import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeElementsOptions, StripeCardElementOptions, PaymentIntent } from '@stripe/stripe-js';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { PaymentService } from 'src/app/core/services/payment.service';
import { countryList } from '../asset-details/countries';
import { HotToastService } from '@ngneat/hot-toast';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  active = false;
  firstName: string;
  lastName: string;
  companyName: string;
  countryId = 'Select Country';
  cardHoldersName: string;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
  countries: any[] = countryList;
  selectedCountry: any;
  paying = false;
  billingAddress: string;
  sellNowValue: number;
  sellNowValueNGN: number;
  fullname: string = "";
  paymentEmail: string;
  paymentAmount: number;
  payId: string = '';
  tokenId: any;
  amount: any;
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#999999',
          fontStyle: 'bold',
          fontSize: '16px',
          fontWeight: '500'
        },
      },
    },
  };
  clientSecret: string;

  constructor(
    private stripeService: StripeService,
    public paymentService: PaymentService,
    public toast: HotToastService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.tokenId = this.activatedRoute.snapshot.params.tokenId;
    this.amount = this.activatedRoute.snapshot.params.amount;
  }

  submit(value) {
    console.log(value);
  }

  continuePayment() {
    this.selectedCountry = this.selectedCountry.name;
    console.log('sel', this.sellNowValue)
    if (this.billingAddress === undefined || this.billingAddress === '') {
      this.toast.error('Please make sure all fields are completed and correct.')
      return;
    }
    if (this.paymentEmail === '') {
      this.toast.error('Please make sure all fields are completed and correct.')
      return;
    }
    if (this.selectedCountry === 'Nigeria') {
      this.payWithRave();
    }else {
      this.paymentService.createPaymentIntent(this.sellNowValue * 100, this.paymentEmail)
      .subscribe(pi => {
        this.clientSecret = pi.client_secret;
        this.elementsOptions.clientSecret = pi.client_secret;
        this.payId = pi.id;
        this.paying = true;
      });
    }
  }

  payWithRave() {
    this.paymentService.payWithRave(this.paymentEmail, this.sellNowValueNGN,
    '090332323323', 'djskd767'
    ).subscribe((res: any) => {
      console.log('res', res)
    })
  }

  getCountry(country: any) {
    this.selectedCountry = country;
    this.countryId = country;
    console.log(country);
  }

  pay() {
    this.stripeService.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card.element,
        billing_details: {
          name: this.fullname,
        },
      }}).subscribe(result => {
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

}
