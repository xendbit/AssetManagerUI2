import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
  ICustomer,
  ICustomise,
  IFlutterwaveCheckoutResponse,
  IFlutterwaveCredentials,
  IFlutterwaveParameters
} from './flutterwave-interface';
import { FLUTTERWAVE_PAYMENT_DETAILS } from './flutterwave-credential-token';
import {PaymentGatewayMode} from '../interfaces/payment.interfaces';
import {GatewayTypes} from '../../../..';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InAppBrowser, InAppBrowserObject} from '@ionic-native/in-app-browser';
import {HTTP} from '@ionic-native/http';

declare var FlutterwaveCheckout;

@Injectable()
export class FlutterwavePaymentService {

  public_key: string;
  /** REQUIRED FIELDS
   *
   */
  tx_ref: string;
  amount: number;
  payment_options:string;
  redirect_url: string;
  customer:ICustomer;
  customizations:ICustomise;

  /** OPTIONAL FIELDS
   *
   */
  currency:string = 'NGN';
  country:string = '';
  mode: string = 'test';
  flutterwaveObject: any;
  flutterwaveOptions: any;

  /** CALLBACKS
   *
   */
  callback: Subject<IFlutterwaveCheckoutResponse> = new Subject();
  onCallback: Observable<IFlutterwaveCheckoutResponse> = this.callback.asObservable();
  close: Subject<any> = new Subject();
  onClose: Observable<any> = this.close.asObservable();

  /** CUSTOM
   *
   */
  parameters: IFlutterwaveParameters;
  options: IFlutterwaveParameters;
  scriptId= 'flutterwave-payment';
  urls =  {
    live: 'https://checkout.flutterwave.com/v3.js',
    test: 'https://checkout.flutterwave.com/v3.js'
  }

  constructor(@Inject(FLUTTERWAVE_PAYMENT_DETAILS) private config: IFlutterwaveCredentials, protected http:HttpClient){
    // this.loadflutterwave();
  }
  init(mode?: PaymentGatewayMode){
    mode = mode || this.config.activeMode || PaymentGatewayMode.TEST;
    this.setMode(mode);
  }
  loadFlutterwave() {
    const id = `${this.scriptId}-${this.mode}`;
    if (document.getElementById(id)){
      return;
    }
    let script = document.createElement("script");
    script.id = id;
    if (this.mode == 'test') {
      script.src = this.urls.test;
    } else {
      script.src = this.urls.live;
    }
    document.body.appendChild(script);
  }
  unloadFlutterwave(){
    const id = `${this.scriptId}-${this.mode}`;
    if (document.getElementById(id)){
      document.getElementById(id).remove();
    }
    let fwFrame = document.getElementsByName("checkout");
    const size = fwFrame.length;
    for(let x=0;x<size;x++){
      try {
        fwFrame[x].remove();
      }catch(e){
        console.log("FWGateway-unloadFlutterwave-RemoveFWClass",e);
      }
    }
    if(document.getElementById("flwpugpaidid")){
      try {
        document.getElementById("flwpugpaidid").remove();
      }catch(e){
        console.log("FWGateway-unloadFlutterwave-RemoveFWId",e);
      }
    }
    let fwSpinner = document.getElementsByClassName("spinner-container");
    const nextSize = fwSpinner.length;
    for(let x=0;x<nextSize;x++){
      try {
        fwSpinner[x].remove();
      }catch(e){
        console.log("FWGateway-unloadFlutterwave-RemoveFWSpinner",e);
      }
    }
  }
  setUpFlutterwaveOptions(options: IFlutterwaveParameters){
    this.options = options;
    return this;
  }
  destroyFlutterwaveOptions(){
    this.options = undefined;
    return this;
  }
  setMode(mode: PaymentGatewayMode){
    // get current script loaded
    // if current script id ==
    const id = `${this.scriptId}-${this.mode}`;
    const newId = `${this.scriptId}-${mode}`;
    const alreadyExistingScript = document.getElementById(id);
    this.mode = mode;
    if (alreadyExistingScript && alreadyExistingScript.id != newId) {
      document.body.removeChild(alreadyExistingScript);
    }
    this.loadFlutterwave();
    return this;
  }
  pay() {
    if (typeof FlutterwaveCheckout !== 'undefined') {
      this.flutterwaveOptions = this.getFlutterwaveOptions(this.options);
      this.flutterwaveObject = FlutterwaveCheckout(this.flutterwaveOptions);
      console.log(this.flutterwaveObject);
    }else{
      throw new Error("Payment gateway was not successfully setup: function FlutterwaveCheckout not defined");
    }
    return this;
  }
  removePay() {
    this.flutterwaveOptions = undefined;
    this.flutterwaveObject = undefined;
    return this;
  }
  getFlutterwaveOptions(params: IFlutterwaveParameters):IFlutterwaveParameters {
    const mode = this.mode || this.config.activeMode;
    const options:IFlutterwaveParameters = {
      public_key: params.public_key || this.config.modes[this.mode].publicKey,
      tx_ref: params.tx_ref,
      amount: params.amount,
      currency: params.currency || "NGN",
      payment_options:params.payment_options || " ",
      redirect_url:params.redirect_url,
      meta: params.meta || null,
      customer: params.customer,
      customizations: params.customizations,
      onclose: () => {
        this.close.next();
      },
      callback: (response: IFlutterwaveCheckoutResponse) => {
        var tx_ref = response.tx_ref, status = response.status;
        if (status == "successful") {
          this.callback.next(response)
        } else {
          this.callback.error(response);
        }
        console.log(response);
        this.flutterwaveObject.close(); // use this to close the modal immediately after payment.
      }
    }
    if (typeof this.parameters != 'undefined') {
      return Object.assign(options, this.parameters);
    }
    return options;
  }

  preRender(_mode:PaymentGatewayMode,params?: IFlutterwaveParameters,_extHttp?:HttpClient | HTTP) {
    const url = this.config.initializeUrl;
    if(undefined == params || null == params){
      params = this.options;
    }
    if(undefined === this.http || null === this.http &&
      (undefined !== _extHttp || null !== _extHttp)){
      const http = this.http;
    }
    if(this.http instanceof HttpClient){
      const http = this.http;
      return new Promise(function (resolve, reject) {
        return http.post(url, params, { headers: { 'content-type': 'application/json','Access-Control-Allow-Origin': '*' } }).subscribe(function (response) {
          if (response["status"] == "error")
            reject(response["message"]);
          else
            resolve(response["data"]["link"]);
        });
      });
    }
    else if(_extHttp instanceof HTTP){
      return new Promise(function (resolve, reject) {
        const theHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        return _extHttp.post(url, params, {}).then(function (response) {
          if (response.data["status"] == "error")
            reject(response["message"]);
          else
            resolve(response["data"]["link"]);
        });
      });
    }

  };
  render(paymentLink, iab:InAppBrowser) {
    //@ts-ignore
    return iab.create(paymentLink.toString(), '_blank');
  };
}
