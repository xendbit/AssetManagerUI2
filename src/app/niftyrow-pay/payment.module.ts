import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { Angular4PaystackComponent, Angular4PaystackModule } from 'angular4-paystack';
// import { Angular4PaystackEmbed } from 'angular4-paystack';
// import { PaystackGateway } from './handlers/paystackgateway';
import { PaymentComponent } from './payment.component';
// import { PAYSTACK_KEY } from './paystack-key.token';
// import {PaystackDetails} from './handlers/paystack-details';
import {RaveDetails} from './handlers/rave-details';
import {RaveGateway} from './handlers/rave-gateway';

// @dynamic
// export function setUpPaystackScript(/* dependencies */){
//   const runtimeFunction = function(): Promise<any>  {
//       return new Promise((resolve, reject) => {
//         const target = document.getElementsByTagName('head')[0];
//         const newScript = document.createElement('script');
//         newScript.src = 'https://js.paystack.co/v1/inline.js';
//         target.appendChild(newScript);
//         resolve();
//       }
//     );
//   }
//   return runtimeFunction;
// }

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, FormsModule],
  exports: [PaymentComponent],
  providers: [RaveGateway,RaveDetails],
  entryComponents: [
    // Angular4PaystackComponent,
    // Angular4PaystackEmbed
  ]
})

// @dynamic
export class PaymentModule {
  // static register(paystackKey: string): ModuleWithProviders {
  //   return {
  //     ngModule: PaymentModule,
  //     providers: [
  //       // { provide: PAYSTACK_KEY, useValue: paystackKey },
  //       {
  //         provide: APP_INITIALIZER,
  //         // useFactory: setUpPaystackScript,
  //         deps: [],
  //         multi: true,
  //       },
  //     ]
  //   };
  // }
}
