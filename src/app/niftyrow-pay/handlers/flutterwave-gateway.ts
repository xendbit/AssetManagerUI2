import { Injectable } from '@angular/core';
import {IPayment, IFieldlist, GatewayTypes, ISingleItemPayment, IPaymentGatewayDetails} from '../interfaces/payment.interfaces';
import {ENV} from '../../../config/default-environment';
import {AlertController, LoadingController, Platform} from 'ionic-angular';
import {ITransactionFields} from '../index';
import {WooOrder} from '../../../providers/woo/woo.interfaces';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InAppBrowser, InAppBrowserEvent, InAppBrowserObject} from '@ionic-native/in-app-browser';
import {IFlutterwaveEnvData, PaymentGatewayMode} from '../../../../index';
import {FlutterwavePaymentService} from '../flutterwave/flutterwave-payment.service';
import {FlutterwaveDetails} from './flutterwave-details';
import {IFlutterwaveCheckoutResponse} from '../flutterwave/flutterwave-interface';
import { HTTP } from '@ionic-native/http';

/**
 *
 */
@Injectable()
export class FlutterwaveGateway implements IPayment {
  mode:IFlutterwaveEnvData;

  /**
   *
   */
  public constructor(
    protected platform: Platform,
    protected iab: InAppBrowser,
    protected http:HttpClient,
    protected loadingCtrl: LoadingController,
    protected alertCtrl: AlertController,
    protected details:FlutterwaveDetails,
    // protected rave:Flutterwave,
    // protected ravePayment: FlutterwavePayment,
    protected fwPaymentService: FlutterwavePaymentService,
    private servHttp: HTTP
  ) {}


  verifyPaymentRef(_serverUrl,_transactionRef){
    // verify on the server
    return this.servHttp.get(_serverUrl + 'tx_ref=' + _transactionRef,{}, {});
  }

  paymentSuccessHandler(fundWalllet,baseRef,_onSuccess,orderIdOrAmount,transactionRef){
    const ref = this;
    if (fundWalllet) {
      ref.onReceiveMsg({ref: baseRef, onSuccess: _onSuccess, orderId: orderIdOrAmount, referenceId: transactionRef});
    }
    else {
      ref.onReceiveMsg({ref: baseRef, onSuccess: _onSuccess, orderId: orderIdOrAmount, referenceId: transactionRef});
    }
  }
  /**
   * used to make a payment via a payment Handler that implements this interface
   *
   * @param _transactionId unique reference or transactionId
   * @param _amount the amount being paid
   * @param _qty the number of items being bought,
   *  the default should be 1 but if this is greater than 1 the total amount being debited would be _qty * _amount
   * @param _userId unique identifier for the user, it could be an email, database userId etc
   * @param _onComplete the function to be invoked when a payment has been succesfull
   * @param _onCancel function to be invoked when the user cancels a payment
   * @param _onFail the function to be invoked if the payment fails
   * @param _options a fieldlist of key > value pairs that can be used by
   *  the implementing classes to pass in additional value not supported in the argument list
   * @param _itemId the id/reference of the the item being purchased
   */
  makePayment(
    _transactionId: string,
    _amount: number,
    _options: IFieldlist,
    _onSuccess: Function,
    _onComplete?: Function,
    _onStart?: Function,
    _onCancel?: Function,
    _onFail?: Function,
    _item?:ISingleItemPayment
  ): void {
    const transactionFields:ITransactionFields = <ITransactionFields>_options['transaction'];
    const baseRef = _options['baseRef'];
    const mode = _options['mode'];
    const theOrder:WooOrder = <WooOrder>_options['activeOrder'];
    const fundWalllet: boolean = _options['fundWallet'];
    const transactionRef = _transactionId;
    // setup the constant according to the enviroment
    let gatewayMode:PaymentGatewayMode;
    if(undefined !== mode && null !== mode){
      if (mode === PaymentGatewayMode.LIVE) {
        this.mode = this.details.getPaymentDetails().modes.live;
        gatewayMode = PaymentGatewayMode.LIVE;
      }
      else if (mode === PaymentGatewayMode.TEST) {
        this.mode = this.details.getPaymentDetails().modes.test;
        gatewayMode = PaymentGatewayMode.TEST;
      }
    }
    else{
      if (ENV.production) {
        this.mode = this.details.getPaymentDetails().modes.live;
        gatewayMode = PaymentGatewayMode.LIVE;
      }
      else if (!ENV.production) {
        this.mode = this.details.getPaymentDetails().modes.test;
        gatewayMode = PaymentGatewayMode.TEST;
      }
    }
    let orderIdOrAmount:number;
    if(fundWalllet){
      orderIdOrAmount = _amount;
    }
    else{
      orderIdOrAmount = theOrder.id;
    }
    _onStart();
    const preLoader = this.loadingCtrl.create({
      content: 'Loading Payment Gateway'
    });
    preLoader.present();
    // this.fwPaymentService.init(gatewayMode).then(_ => {
    let payNow:boolean = false;
    if(null !== _options.payNow && undefined !== _options.payNow){
      payNow = _options.payNow;
    }
    try{
      let redirect = this.details.getPaymentDetails().redirectUrl;
      if(undefined !== transactionFields.redirect_url && null !== transactionFields.redirect_url){
        redirect = transactionFields.redirect_url;
      }
      if(payNow){
        const paymentObject = {
          customer: transactionFields.customer,
          amount: parseFloat(theOrder.total),
          currency: this.details.getPaymentDetails().currency,
          redirect_url: redirect,
          tx_ref: transactionRef,
          public_key: this.mode.publicKey,
          payment_options: " ",
          customizations: transactionFields.customizations,
          subaccounts: transactionFields.subaccounts,
          onclose:() =>{
            preLoader.dismiss();
            _onComplete();
          },
          callback:(response: IFlutterwaveCheckoutResponse) =>{
            preLoader.dismiss();
            _onComplete();
            const loader = this.loadingCtrl.create({
              content: 'Verifying Payment'
            });
            loader.present();
            if (response.status == 'successful') {
              if(fundWalllet){
                orderIdOrAmount = parseFloat(theOrder.total);
              }
              this.paymentSuccessHandler(fundWalllet,baseRef,_onSuccess,orderIdOrAmount,transactionRef);
              loader.dismiss();
            }
            else {
              loader.dismiss();
              const alert = this.alertCtrl.create({
                title: "Payment error",
                message: "An error occured with the payment transaction, please contact support"
              });
              alert.present();
            }
          }
        };
        let retVal = this.fwPaymentService.setUpFlutterwaveOptions(paymentObject).pay();
        const fwFrame = document.getElementsByName("checkout");
        const parent = this;
        var theInterval = setInterval(() =>{
          if (fwFrame.length > 1){
            clearInterval(theInterval);
            preLoader.dismiss();
            if(fundWalllet){
              orderIdOrAmount = parseFloat(theOrder.total);
            }
            this.paymentSuccessHandler(fundWalllet,baseRef,_onSuccess,orderIdOrAmount,transactionRef);
            _onComplete();
            this.fwPaymentService.unloadFlutterwave();
/*
            // check to see if the data is valid
            parent.verifyPaymentRef(transactionFields.redirect_url, transactionRef).
            then(_response => {
                if(_response.data['status'] === true){
                  const alert = this.alertCtrl.create({
                    title: "Success",
                    message: "Your payment of "+paymentObject.currency+paymentObject.amount+" and ref:("+transactionFields.ref+") was successful"
                  });
                  alert.present();
                  this.paymentSuccessHandler(fundWalllet,baseRef,_onSuccess,orderIdOrAmount,transactionRef)
                }
                console.log("verifyPaymentRef",_response);
                _onComplete();
              },
              error1 => {
                console.log("verifyPaymentRef",error1);
                if(undefined !== _onFail && null !== _onFail) {
                  _onFail();
                }
                _onComplete();
              }).catch(error1 => {
                console.log("verifyPaymentRef",error1);
                if(undefined !== _onFail && null !== _onFail) {
                  _onFail();
                }
                _onComplete();
              });
*/
          }
        },1000);
      }
      else {
        const paymentObject = {
          customer: transactionFields.customer,
          amount: parseFloat(theOrder.total),
          currency: this.details.getPaymentDetails().currency,
          redirect_url: redirect,
          tx_ref: transactionRef,
          public_key: this.mode.publicKey,
          payment_options: " ",
          customizations: transactionFields.customizations,
          subaccounts: transactionFields.subaccounts
        }
        this.fwPaymentService.setUpFlutterwaveOptions(paymentObject).preRender(gatewayMode,null,this.servHttp).then(secure_link => {
          secure_link = secure_link + " ";
          // if(this.platform.is('unknown_app_1')) {
          if(this.platform.is('cordova')) {
            const browser: InAppBrowserObject = this.fwPaymentService.render(secure_link, this.iab);
            preLoader.dismiss();
            browser.on("loadstop").subscribe((event: InAppBrowserEvent) => {
                if (event.url.indexOf(transactionRef) != -1) {
                  // let urlResponse = decodeURIComponent(event.url).split("?")[0];
                  // if (urlResponse.charAt(0) == '=') {
                  //   urlResponse = urlResponse.slice(1);
                  // }
                  // const responseToJson = JSON.parse(urlResponse);
                  browser.close();
                  this.verifyPaymentRef(transactionFields.redirect_url, transactionRef).then(_result => {
                    const loader = this.loadingCtrl.create({
                      content: 'Verifying Payment'
                    });
                    loader.present();
                    if (_result.data.status === true || _result.data.status === "true") {
                      this.paymentSuccessHandler(fundWalllet,baseRef,_onSuccess,orderIdOrAmount,transactionRef)
                      loader.dismiss();
                    }
                    else {
                      loader.dismiss();
                      const alert = this.alertCtrl.create({
                        title: "Payment error",
                        message: "An error occured with the payment transaction, please contact support"
                      });
                      alert.present();
                    }
                  }).catch((error) => {
                    _onComplete();
                    preLoader.dismiss();
                    console.log('in app browser error: ' + error);
                    const alert = this.alertCtrl.create({
                      title: "Payment error",
                      message: "An error occured with the payment transaction, please contact support"
                    });
                    alert.present();
                  });
                  _onComplete();
                  this.fwPaymentService.unloadFlutterwave();
                }
              },
              (error) => {
                _onComplete();
                preLoader.dismiss();
                console.log('in app browser error: ' + error);
                const alert = this.alertCtrl.create({
                  title: "Payment error",
                  message: "An error occured with the payment transaction, please contact support"
                });
                alert.present();
              })
          }
          else{
            preLoader.dismiss();
            const retVal = window.open(secure_link.toString(),"_blank","top=100,hardwareback=yes");
            const parent = this;
            var theInterval = setInterval(() =>{
              if (retVal.closed){
                clearInterval(theInterval);
                // check to see if the data is valid
                parent.verifyPaymentRef(transactionFields.redirect_url, transactionRef).
                then(_response => {
                    if(_response.data['status'] === true){
                      const alert = this.alertCtrl.create({
                        title: "Success",
                        message: "Your payment of "+paymentObject.currency+paymentObject.amount+" and ref:("+transactionFields.ref+") was successful"
                      });
                      alert.present();
                      this.paymentSuccessHandler(fundWalllet,baseRef,_onSuccess,orderIdOrAmount,transactionRef)
                    }
                    console.log("verifyPaymentRef",_response);
                    _onComplete();
                  },
                  error1 => {
                    console.log("verifyPaymentRef",error1);
                    if(undefined !== _onFail && null !== _onFail) {
                      _onFail();
                    }
                    _onComplete();
                  }).catch(error1 => {
                  console.log("verifyPaymentRef",error1);
                  if(undefined !== _onFail && null !== _onFail) {
                    _onFail();
                  }
                  _onComplete();
                });
              }
            },500);
          }
        }).catch(error => {
          _onComplete();
          preLoader.dismiss();
          console.log("rave payment failed error: " + error);
          // Error or invalid paymentObject passed in
          const alert = this.alertCtrl.create({
            title: "Payment error",
            message: "An error occured with the payment transaction, please contact support"
          });
          alert.present();
        });
      }
    }
    catch(e){
      _onComplete();
      preLoader.dismiss();
      console.log("rave payment setup error: ",e);
      const alert = this.alertCtrl.create({
        title: "Payment error",
        message: "A error loading the payment gateway, please contact support"
      });
      alert.present();
    }
  }

  /**
   * invoked when a user cancels a payment request after attempting to make a payment
   *
   * @param _fieldset a key:value object of optional parameters
   */
  onCancel(_fieldset: IFieldlist): void {console.log('customer canceled')}

  /**
   * invoked when a response is returned after the result of a payment or cancellation request
   *
   * @param _fieldset a key:value object of optional parameters
   */
  onReceiveMsg(_fieldset: IFieldlist): void {
    console.log(_fieldset);
    const onCompleteCallback:Function = _fieldset['onSuccess'];
    const orderId:any = _fieldset['orderId'];
    const referenceId:string = _fieldset['referenceId'];
    const reference:string = _fieldset['ref'];
    onCompleteCallback(orderId,referenceId,GatewayTypes.FLUTTERWAVE,reference);
  }

  getDetails():IPaymentGatewayDetails{
    return <IPaymentGatewayDetails>this.details.getPaymentDetails();
  }

  initPayment(_dataSet:any):Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.details.getPaymentDetails().initializeUrl, _dataSet, httpOptions).toPromise();
  }

  /**
   * A function to be used to perform any pre-usage intialisations that the implementing gateway may require
   *
   * @param _fieldset initialises the gateway with any parameters required by it, e.g. unique public key
   */
  init(_fieldset?: IFieldlist[]): void {
    this.fwPaymentService.init(this.details.getPaymentDetails().activeMode);
  }

  /**
   * updates the payment gateway keys and other settings
   * @param IPaymentGatewayDetails _details
   */
  updateDetails(_details:IPaymentGatewayDetails):void{
    this.details.setPaymentDetails(_details);
  }
}
