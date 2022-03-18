import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { PaymentService } from 'src/app/core/services/payment.service';
import { countryList } from '../asset-details/countries';
import { HotToastService } from '@ngneat/hot-toast';

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
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private stripeService: StripeService,
    public paymentService: PaymentService,
    public toast: HotToastService) { }

  ngOnInit(): void {
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
    console.log('th', this.paymentElement)
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

}
