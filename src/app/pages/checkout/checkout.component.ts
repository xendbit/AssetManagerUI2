import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeElementsOptions, StripeCardElementOptions, PaymentIntent } from '@stripe/stripe-js';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { PaymentService } from 'src/app/core/services/payment.service';
import { countryList } from '../asset-details/countries';
import { HotToastService } from '@ngneat/hot-toast';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { NgForm } from '@angular/forms';

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
  email: string;
  paying = false;
  billingAddress: string;
  state: string;
  city: string;
  street: string;
  phone: number;
  zip: any;
  sellNowValue: number;
  sellNowValueNGN: number;
  fullname: string = "";
  paymentEmail: string;
  paymentAmount: number;
  payId: string = '';
  tokenId: any;
  userWallet: any;
  amount: any;
  accountFound: boolean = false;
  account: string;
  error: string;
  artwork = {"id": "","category": "","tags": [],        "auctions": { "auctionId": "",
  "cancelled": false, "chain": "", "currentBlock": "", "endBlock": "", "endDate": "", "finished": false, "highestBid": "",
  "highestBidder": "", "id": 0, "minimumBid": "", "owner": "", "sellNowPrice": "", "sellNowTriggered": false,
  "startBlock": "", "startDate": "", "started": true, "tokenId": ""},
      "owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "",
      "collections": [],"type": ""},"featuredImage": {"media": "","mediaType": 0},"isBidding": true, "gallery": [{ "media": "",
      "mediaType": 0 }], "description": "", "price": 0, "currency": "", "dateIssued": 0, "hasActiveAuction": true, "lastAuctionId": 0, "likes": [], "assetType": "digital", "sold": false, "name": "", "tokenId": 0, "symbol": "", "type": ""};
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
    private ngxService: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private metamaskService: MetamaskService
    ) { }

  ngOnInit(): void {
    this.checkConnection();
    this.artwork = JSON.parse(localStorage.getItem('artworkData'));
    this.tokenId = this.activatedRoute.snapshot.params['tokenId'];
    this.amount = this.activatedRoute.snapshot.params['amount'];
  }

  continuePayment() {
    this.ngxService.start();
    this.selectedCountry = this.selectedCountry.name;
    this.paymentEmail = this.email;
    this.billingAddress = this.street + ',' + this.city + ',' + this.state + ',' + this.selectedCountry;
    if (this.billingAddress === undefined || this.billingAddress === '') {
      this.toast.error('Please make sure all fields are completed and correct.')
      return;
    }
    if (this.paymentEmail === '') {
      this.toast.error('Please make sure all fields are completed and correct.')
      return;
    }
    this.paymentService.createPaymentIntent(this.amount * 100, this.paymentEmail)
    .subscribe(pi => {
      this.clientSecret = pi.client_secret;
      this.elementsOptions.clientSecret = pi.client_secret;
      this.payId = pi.id;
      this.paying = true;
      this.pay(this.clientSecret);
    });
    // if (this.selectedCountry === 'Nigeria') {
    //   this.payWithRave();
    // } else {
    //   this.paymentService.createPaymentIntent(this.amount * 100, this.paymentEmail)
    //   .subscribe(pi => {
    //     this.clientSecret = pi.client_secret;
    //     this.elementsOptions.clientSecret = pi.client_secret;
    //     this.payId = pi.id;
    //     this.paying = true;
    //     this.pay(this.clientSecret);
    //   });
    // }
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
  }

  pay(clientSecret: any) {
    this.stripeService.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card.element,
        billing_details: {
          name: this.firstName + ' ' + this.lastName,
        },
      }}).subscribe(result => {
        this.paying = false;
        if (result.error) {
          this.ngxService.stop();
          this.toast.error(result.error.message)
        } else {
          console.log('err', result.paymentIntent.status)
          if (result.paymentIntent.status === 'succeeded') {
            this.ngxService.stop();
            this.toast.success('Payment made successfully.')
            // this.router.navigate(['/profile']).then(() => {
            //   this.toast.success(this.artwork.symbol + ' Has been added to the list of artworks under your profile.');
            //   window.location.reload();
            // });
            // this.metamaskService.bought(this.artwork.tokenId).then(res => {
            //   this.router.navigate(['/profile']).then(() => {
            //     this.toast.success(this.artwork.symbol + ' Has been added to the list of artworks under your profile.');
            //     window.location.reload();
            //   });
            // }, err => {
            //   console.log('err', err)
            // })
          } else {
            this.toast.error('There was an error while trying to purchase this artwork.')
          }
        }
      });
  }

  confirm(form: NgForm) {
    this.confirmationService.confirm({
        message: 'Please cnfirm that you intend to buy ' + this.artwork.symbol + ' at ' + this.amount,
        accept: () => {
            // this.continuePayment();
            this.saveShippingInfo(form);
        }
    });
  }

  checkConnection() {
    this.userWallet = localStorage.getItem('userWallet');
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        this.metamaskService.checkConnection().then(res => {
          if (res === undefined || !localStorage.getItem('account')) {
            this.accountFound = false;
            this.error = 'Please Connect to your Metamask wallet account.'
            return;
          } else {
            this.accountFound = true;
            this.account = localStorage.getItem('account');
          }
        })
      }
      if (this.userWallet === 'WalletConnect' && localStorage.getItem('account')) {
        this.accountFound = true;
        this.account = localStorage.getItem('account');
      }
    }
  }

  saveShippingInfo(form: NgForm) {
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const email = form.value.email;
    const street = form.value.street;
    const city = form.value.city;
    const country = this.selectedCountry;
    const zipCode = form.value.zipCode;
    const phoneNumber = form.value.phoneNumber;
    const userWalletAddress = this.account;
    console.log('this is form', city, this.account)
    this.continuePayment();
    this.paymentService.saveShippingInfo(firstName, lastName, email, street, city, country, zipCode, phoneNumber, userWalletAddress).subscribe(res => {
      console.log('response', res)
      // this.toast.success('Shipping Information Has been saved successfully');
    },
    error => {
      console.log('error', error)
      // this.toast.success(this.artwork.symbol + ' Has been added to the list of artworks under your profile.');
    })

  }

}
