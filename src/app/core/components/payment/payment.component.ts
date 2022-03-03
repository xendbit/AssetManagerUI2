import { AfterViewInit, OnInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { StripeService, StripePaymentElementComponent, StripeCardComponent} from 'ngx-stripe';
import { PaymentService } from '../../services/payment.service';
import {
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { UserActionsService } from '../../services/userActions.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentElement: StripePaymentElementComponent;

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paying = false;
  fullname: string = "";
  payId: string = '';

  constructor(private stripeService: StripeService, private cd: ChangeDetectorRef,
    public userService: UserActionsService,
    public paymentService: PaymentService) {
  }

  ngOnInit(): void {
  }

  pay() {
     this.paymentService.createPaymentIntent(200)
    .subscribe(pi => {
      this.elementsOptions.clientSecret = pi.client_secret;
      this.payId = pi.id;
    });
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.fullname
            }
          }
        },
        redirect: 'if_required'
      }).subscribe(result => {
        this.paying = false;
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
  }

  payWithRave() {
    this.paymentService.payWithRave('chinedukogu@gmail.com', 100,
    '090332323323', 'djskd767'
    ).subscribe((res: any) => {
      console.log('res', res)
    })
  }

}
