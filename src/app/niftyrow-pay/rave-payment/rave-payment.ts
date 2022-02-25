import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IRaveParameters } from './rave-interface';

declare var getpaidSetup;
/**
 * Generated class for the RavePaymentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rave-payment',
  templateUrl: 'rave-payment.html'
})
export class RavePaymentComponent implements OnInit{


  @Input()  PBFPubKey: string;
  @Input()  txref: string;
  @Input()  amount: number;
  @Input()  customer_email: string;
  @Input()  customer_phone: string;
  @Input()  mode: string = 'live';
  @Output() callback: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any>  = new EventEmitter();
  @Input()  parameters: IRaveParameters;
  options: IRaveParameters;
  raveObject: any;
  raveOptions: any;
  constructor() {
    console.log('Hello RavePaymentComponent Component');
    // this.loadRave();
  }
  loadRave(){
    let script = document.createElement("script");
    script.id = "rave-payment";

    if (this.mode == 'test') {
      script.src = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/flwpbf-inline.js';
    } else {
      script.src = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js';
    }

    document.body.appendChild(script);

  }
  ngOnInit(): void {
    this.loadRave();
  }
  payWithRave() {
    if (typeof getpaidSetup !== 'undefined'){
      this.raveOptions = this.getRaveOptions();
      this.raveObject = getpaidSetup(this.raveOptions);
      console.log(this.raveObject);
    }
  }
  getRaveOptions(){
    const options = {
      PBFPubKey: this.PBFPubKey,
      customer_email: this.customer_email,
      amount: this.amount,
      customer_phone: this.customer_phone ,
      currency: "NGN",
      txref: this.txref,
      onclose:  () => {
        this.onClose.emit();
      },
      callback:  (response) =>  {
        var txref = response.tx.txRef, chargeResponse = response.tx.chargeResponseCode;
        if (chargeResponse == "00" || chargeResponse == "0") {

          this.callback.emit(response)
        }else{
          this.callback.error(response);
        }
        console.log(response);
        this.raveObject.close(); // use this to close the modal immediately after payment.
      }
    }
    if (typeof this.parameters != 'undefined'){

      return Object.assign(options, this.parameters);
    }
    return options;
  }
}
