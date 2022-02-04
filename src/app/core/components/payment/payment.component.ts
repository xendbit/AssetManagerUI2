import { Component, OnInit, ViewChild} from '@angular/core';
import {  NgForm } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(private stripeService: StripeService) { }

  ngOnInit(): void {
  }

  createToken(): void {
    const name = "chinedu";
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result);
         return this.stripeService.redirectToCheckout({ sessionId: 'hbhjbhbjh' }).subscribe(res => {
            console.log('thisi', res)
          })
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

}
