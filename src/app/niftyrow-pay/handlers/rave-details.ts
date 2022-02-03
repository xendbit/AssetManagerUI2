import {Injectable} from '@angular/core';
import {IRaveCredentials} from '../rave-payment/rave-payment.service';
import {IPaymentGatewayDetails, PaymentGatewayMode} from '../interfaces/payment.interfaces';

@Injectable()
export class RaveDetails {
  protected details: IRaveCredentials;

  constructor(){
    this.details = {
      modes: {
        'test': {
          publicKey: '',
          isProduction: false
        },
        'live': {
          publicKey: '',
          isProduction: true
        }
      },
      redirectUrl: '',
      currency: 'NGN',
      paymentMethod: 'ravepay',
      activeMode: PaymentGatewayMode.LIVE,
      initializeUrl: 'https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/hosted/pay'
    };
  }

  getPaymentDetails():IRaveCredentials{
    return this.details;
  }
  setPaymentDetails(_details:IPaymentGatewayDetails){
    this.details = _details;
  }
}
