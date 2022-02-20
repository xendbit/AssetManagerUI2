import { AfterViewInit, OnInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { StripeService, StripeCardComponent, StripePaymentElementComponent} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent
} from '@stripe/stripe-js';
import { UserActionsService } from '../../services/userActions.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paying = false;
  fullname: string = "";
  payId: string = '';

  constructor(private stripeService: StripeService, private cd: ChangeDetectorRef, 
    public userService: UserActionsService, public httpClient: HttpClient) { 
  }

  ngOnInit(): void {

  }

  pay() {
     this.createPaymentIntent()
    .subscribe(pi => {
      this.elementsOptions.clientSecret = pi.client_secret;
      console.log('resp,', pi)
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

  createPaymentIntent(): Observable<PaymentIntent> {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Authorization', 'my-auth-token')
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post<PaymentIntent>('https://node-stripe-nifty.herokuapp.com/charge', {
      amount: 200
    }, {headers})
  }

}
