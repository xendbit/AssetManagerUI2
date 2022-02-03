import {Injectable} from '@angular/core';
import {IPaymentGatewayDetails, PaymentGatewayMode} from '../interfaces/payment.interfaces';
import {IFlutterwaveCredentials} from '../../../..';

@Injectable()
export class FlutterwaveDetails {
  protected details: IFlutterwaveCredentials;

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
      paymentMethod: 'flutterwave',
      activeMode: PaymentGatewayMode.LIVE,
      initializeUrl: 'https://api.flutterwave.com/v3/payments'
    };
  }

  getPaymentDetails():IFlutterwaveCredentials{
    return this.details;
  }
  setPaymentDetails(_details:IPaymentGatewayDetails){
    this.details = _details;
  }
}
