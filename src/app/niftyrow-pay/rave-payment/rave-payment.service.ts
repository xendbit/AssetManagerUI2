import { PaymentGatewayMode } from './../payment.interfaces';
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { IRaveCheckoutResponse, IRaveParameters } from './rave-interface';
import { RAVE_PAYMENT_DETAILS } from './rave-credential-token';

declare var getpaidSetup;
export interface IRaveCredentials{
  activeMode: PaymentGatewayMode;
  modes: {
    [key: string]: IRaveEnvData;
  };
  redirectUrl?: string;
  currency?: string;
  paymentMethod?: string;
  initializeUrl?: string;
}
export interface IRaveEnvData{
  publicKey: string,
  isProduction?:boolean
}

@Injectable()
export class RavePaymentService {

  PBFPubKey: string;
  txref: string;
  amount: number;
  customer_email: string;
  customer_phone: string;
  mode: string = 'test';
  callback: Subject<IRaveCheckoutResponse> = new Subject();
  onCallback: Observable<IRaveCheckoutResponse> = this.callback.asObservable();
  close: Subject<any> = new Subject();
  onClose: Observable<any> = this.close.asObservable();
  parameters: IRaveParameters;
  options: IRaveParameters;
  raveObject: any;
  raveOptions: any;
  scriptId= 'rave-payment';
  urls =  {
    live: 'https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js',
    test: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/flwpbf-inline.js'
  }
  constructor(@Inject(RAVE_PAYMENT_DETAILS) private config: IRaveCredentials){
    // this.loadRave();
  }
  init(mode?: PaymentGatewayMode){
    mode = mode || this.config.activeMode || PaymentGatewayMode.TEST;
    this.setMode(mode);
  }
  loadRave() {
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
  setUpRaveOptions(options: IRaveParameters){
    this.options = options;
    return this;
  }
  destroyRaveOptions(){
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
    this.loadRave();
    return this;
  }
  pay() {
    if (typeof getpaidSetup !== 'undefined') {
      this.raveOptions = this.getRaveOptions(this.options);
      this.raveObject = getpaidSetup(this.raveOptions);
      console.log(this.raveObject);
    }else{
      throw new Error("Payment gateway was not successfully setup: function getpaidSetup not defined");
    }
    return this;
  }
  removePay() {
    this.raveOptions = undefined;
    this.raveObject = undefined;
    return this;
  }
  getRaveOptions(params: IRaveParameters) {
    const mode = this.mode || this.config.activeMode;
    const options = {
      PBFPubKey: params.PBFPubKey || this.config.modes[this.mode].publicKey,
      customer_email: params.customer_email,
      amount: params.amount,
      customer_phone: params.customer_phone,
      currency: params.currency || "NGN",
      txref: params.txref,
      onclose: () => {
        this.close.next();
      },
      callback: (response: IRaveCheckoutResponse) => {
        var txref = response.tx.txRef, chargeResponse = response.tx.chargeResponseCode;
        if (chargeResponse == "00" || chargeResponse == "0") {

          this.callback.next(response)
        } else {
          this.callback.error(response);
        }
        console.log(response);
        this.raveObject.close(); // use this to close the modal immediately after payment.
      }
    }
    if (typeof this.parameters != 'undefined') {

      return Object.assign(options, this.parameters);
    }
    return options;
  }

}
