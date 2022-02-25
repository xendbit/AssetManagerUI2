import {Injectable} from '@angular/core';
import { IPaymentGatewayDetails, PaymentGatewayMode } from 'src/app/core/interfaces/payment.interfaces';
import { IFlutterwaveCredentials } from '../flutterwave/flutterwave-interface';

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
