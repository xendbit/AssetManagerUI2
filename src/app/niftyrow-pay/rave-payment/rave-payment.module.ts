import { NgModule } from '@angular/core';
import { RAVE_PAYMENT_DETAILS } from './rave-credential-token';
import { RavePaymentComponent } from './rave-payment';
import { IRaveCredentials, RavePaymentService } from './rave-payment.service';
export function setUpRaveService(config: IRaveCredentials){
    return new RavePaymentService(config);
}
@NgModule({
  declarations: [
    RavePaymentComponent,
  ],
  imports: [
  ],
  exports:[
      RavePaymentComponent
  ]
})
export class RavePaymentModule {
    static register(config: IRaveCredentials): any{
        return {
            ngModule: RavePaymentModule,
            providers: [
              { provide: RAVE_PAYMENT_DETAILS, useValue: config },
              {
                provide: RavePaymentService,
                useFactory: setUpRaveService,
                deps: [RAVE_PAYMENT_DETAILS],
              },
            ]
          };
    }
};
