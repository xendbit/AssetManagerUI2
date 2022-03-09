import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { PaymentIntent } from '@stripe/stripe-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRaveParameters } from 'src/app/niftyrow-pay/rave-payment/rave-interface';
import { ravePublicKey } from '../config/main.config.const';
declare var getpaidSetup;

@Injectable()
export class PaymentService {
  raveSubject: BehaviorSubject<any>
  mode: string = 'live';
  @Output() callback: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any>  = new EventEmitter();
  parameters: IRaveParameters;
  options: IRaveParameters;
  raveObject: any;
  raveOptions: any;
constructor(public httpClient: HttpClient) {
  this.loadRave();
  this.raveSubject = new BehaviorSubject<any>(this.raveOptions);
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

  payWithRave(customerEmail: string, amount: number,
    customerPhone: string, transactionRef: string) {
      if (typeof getpaidSetup !== 'undefined'){
        this.raveOptions = this.getRaveOptions(customerEmail,
          amount, customerPhone, transactionRef);
        this.raveObject = getpaidSetup(this.raveOptions);
        this.raveSubject.next(this.raveObject); // this will update the behavior subject
        return this.raveSubject.asObservable();
      }
  }


  getRaveOptions(customerEmail: string, amount: number,
    customerPhone: string, transactionRef: string){
    const options = {
      PBFPubKey: ravePublicKey.toString(),
      customer_email: customerEmail,
      amount: amount,
      customer_phone: customerPhone ,
      currency: "NGN",
      txref: transactionRef,
      onclose:  () => {
        this.raveSubject.next('closed');
        this.onClose.emit();
      },
      callback:  (response) =>  {
        var txref = response.tx.txRef, chargeResponse = response.tx.chargeResponseCode;
        if (chargeResponse == "00" || chargeResponse == "0") {
          this.raveSubject.next(response);
          this.callback.emit(response)
        }else{
          this.raveSubject.next(response);
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

  createPaymentIntent(amount: number, email: string): Observable<PaymentIntent> {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Authorization', 'my-auth-token')
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post<PaymentIntent>('https://node-stripe-nifty.herokuapp.com/charge', {
      amount: amount,
      email: email
    }, {headers})
  }

}
