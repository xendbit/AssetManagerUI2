import { Injectable } from '@angular/core';
import {IPayment, IFieldlist, GatewayTypes, ISingleItemPayment, IPaymentGatewayDetails} from '../interfaces/payment.interfaces';
import {ENV} from '../../../config/default-environment';
import {AlertController, LoadingController, Platform} from 'ionic-angular';
import {ITransactionFields} from '../index';
import {RavePaymentService} from '../rave-payment/rave-payment.service';
import {WooOrder} from '../../../providers/woo/woo.interfaces';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InAppBrowser, InAppBrowserEvent, InAppBrowserObject} from '@ionic-native/in-app-browser';
import {IRaveEnvData} from '../rave-payment/rave-payment.service';
import {RaveDetails} from './rave-details';
import {Rave, RavePayment} from 'rave-ionic3';
import {PaymentGatewayMode} from '../../../../index';
import {ObserveOnMessage} from 'rxjs/internal/operators/observeOn';
import {Observable} from 'rxjs';

/**
 *
 */
@Injectable()
export class RaveGateway implements IPayment {
  mode:IRaveEnvData;
  retryInterval;

  /**
   *
   */
  public constructor(
    protected platform: Platform,
    protected iab: InAppBrowser,
    protected http:HttpClient,
    protected loadingCtrl: LoadingController,
    protected alertCtrl: AlertController,
    protected details:RaveDetails,
    protected rave:Rave,
    protected ravePayment: RavePayment,
    protected ravePaymentService: RavePaymentService
  ) {}

  verifyPaymentRef(_serverUrl,_transactionRef){
    // verify on the server
    return this.http.get(_serverUrl + 'txref=' + _transactionRef);
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
    if(undefined !== mode && null !== mode){
      if (mode === PaymentGatewayMode.LIVE) {
        this.mode = this.details.getPaymentDetails().modes.live;
      }
      else if (mode === PaymentGatewayMode.TEST) {
        this.mode = this.details.getPaymentDetails().modes.test;
      }
    }
    else{
      if (ENV.production) {
        this.mode = this.details.getPaymentDetails().modes.live;
      }
      else if (!ENV.production) {
        this.mode = this.details.getPaymentDetails().modes.test;
      }
    }
    let orderIdOrAmount:number;
    if(fundWalllet){
      orderIdOrAmount = parseFloat(theOrder.total);
    }
    else{
      orderIdOrAmount = theOrder.id;
    }
    _onStart();
    const preLoader = this.loadingCtrl.create({
      content: 'Loading Payment Gateway'
    });
    preLoader.present();
    const redirectUrl = this.details.getPaymentDetails().redirectUrl;

    this.rave.init(this.mode.isProduction, this.mode.publicKey).then(_ => {
      let raveObj = {
        customer_email: theOrder.billing.email,
        amount: parseFloat(theOrder.total),
        customer_phone: theOrder.billing.phone,
        currency: this.details.getPaymentDetails().currency,
        // callback:function(_transactionResponse:ICheckoutResponse | ICheckoutFailedResponse | ICheckoutFraudulentTransaction | IRecurringTransactionResponse | IVBVNotEnrolled | IInsufficentFunds | IDeclinedTransaction){
        callback:(_transactionResponse:any) => {
          var txref = _transactionResponse.data.tx.txRef;
          console.log("This is the response returned after a charge", _transactionResponse);
          if ("success" === _transactionResponse.status &&
            "successful" === _transactionResponse.data.tx.status &&
            ("00" == _transactionResponse.data.responsecode || "0" == _transactionResponse.data.responsecode)) {
            // verify on the server
            this.http.get(this.details.getPaymentDetails().redirectUrl+'?txref='+transactionRef).subscribe(_resp =>{
              // this.http.post(this.details.getPaymentDetails().redirectUrl,{txref:txref,flwRef:_transactionResponse.data.tx.flwRef}).subscribe(_resp =>{
              paymentObject.close(); // use this to close the modal immediately after payment.
            },error1 => {
              paymentObject.close(); // use this to close the modal immediately after payment.
              const alert = this.alertCtrl.create({
                title: "Payment error",
                message: "An error occured with the payment transaction ("+error1+"), please contact support",
              });
              alert.present();
            });
          }
          else if("error" === _transactionResponse.status){
            paymentObject.close(); // use this to close the modal immediately after payment.
            const alert = this.alertCtrl.create({
              title: "Payment error",
              message: "An error occured with the payment transaction ("+_transactionResponse.data.message+"), please contact support",
            });
            alert.present();
          }
          else{
            paymentObject.close(); // use this to close the modal immediately after payment.
            const alert = this.alertCtrl.create({
              title: "Payment error",
              message: "An error occured with the payment transaction ("+_transactionResponse.data.responsemessage+"), please contact support",
            });
            alert.present();
          }
        },
        onclose: function(){
          console.log("closed Rave");
        },
        txref: transactionRef,
        subaccounts: transactionFields.subaccounts
      };
      if(undefined !== transactionFields.custom_title && null !== transactionFields.custom_title){
        raveObj['custom_title'] = transactionFields.custom_title;
      }
      if(undefined !== transactionFields.custom_description && null !== transactionFields.custom_description){
        raveObj['custom_description'] = transactionFields.custom_description;
      }
      if(undefined !== transactionFields.custom_logo && null !== transactionFields.custom_logo){
        raveObj['custom_logo'] = transactionFields.custom_logo;
      }
      if(undefined !== transactionFields.metadata && null !== transactionFields.metadata){
        let rvMeta = [];
        for(let nextKey in transactionFields.metadata){
          rvMeta.push({'metaname':nextKey,'metavalue':transactionFields.metadata[nextKey]});
        }
        raveObj['meta'] = rvMeta;
      }
      const paymentObject = this.ravePayment.create(raveObj);
      // handle payments with InAppBrowser when using Cordova
      this.rave.preRender(paymentObject).then(secure_link => {
        secure_link = secure_link + " ";
        if(this.platform.is('cordova')) {
          const browser: InAppBrowserObject = this.rave.render(secure_link, this.iab);
          preLoader.dismiss();
          browser.on("loadstop").subscribe((event: InAppBrowserEvent) => {
              if (event.url.indexOf(transactionRef) != -1) {
                // let urlResponse = decodeURIComponent(event.url).split("?")[0];
                // if (urlResponse.charAt(0) == '=') {
                //   urlResponse = urlResponse.slice(1);
                // }
                // const responseToJson = JSON.parse(urlResponse);
                browser.close();
                this.verifyPaymentRef(transactionFields.redirect_url, transactionRef).subscribe((_result:any) => {
                  const loader = this.loadingCtrl.create({
                    content: 'Verifying Payment'
                  });
                  loader.present();
                  if (_result.status === true || _result.status === "true") {
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
                });
                _onComplete();
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
            });
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
              subscribe(_response => {
                  if(_response['status'] === true){
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
                });
            }
          },500);
        }
      }).catch(error => {
          _onComplete();
          preLoader.dismiss();
          console.log("Rave payment failed error: " + error);
        });
    }).catch(error => {
      _onComplete();
      preLoader.dismiss();
      console.log("Rave payment setup error: "+error);

      // verify on the server
      // this.verifyPaymentRef(transactionFields.redirect_url,transactionRef);
    });
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
    onCompleteCallback(orderId,referenceId,GatewayTypes.RAVE,reference);
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
    this.ravePaymentService.init(this.details.getPaymentDetails().activeMode);
  }

  /**
   * updates the payment gateway keys and other settings
   * @param IPaymentGatewayDetails _details
   */
  updateDetails(_details:IPaymentGatewayDetails):void{
    this.details.setPaymentDetails(_details);
  }
}
