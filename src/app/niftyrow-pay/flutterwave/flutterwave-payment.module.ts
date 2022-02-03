import { NgModule } from '@angular/core';
import { FLUTTERWAVE_PAYMENT_DETAILS } from './flutterwave-credential-token';
import {IFlutterwaveCredentials} from './flutterwave-interface';
import {FlutterwavePaymentService} from './flutterwave-payment.service';
import {HttpClient} from '@angular/common/http';


export function setUpFlutterwaveService(config: IFlutterwaveCredentials,http:HttpClient){
    return new FlutterwavePaymentService(config,http);
}
@NgModule({
  declarations: [
    // FlutterwavePaymentComponent,
  ],
  imports: [
  ],
  exports:[
      // FlutterwavePaymentComponent
  ]
})
export class FlutterwavePaymentModule {
    static register(config: IFlutterwaveCredentials): any{
        return {
            ngModule: FlutterwavePaymentModule,
            providers: [
              { provide: FLUTTERWAVE_PAYMENT_DETAILS, useValue: config },
              {
                provide: FlutterwavePaymentService,
                useFactory: setUpFlutterwaveService,
                deps: [FLUTTERWAVE_PAYMENT_DETAILS],
              },
            ]
          };
    }
};
