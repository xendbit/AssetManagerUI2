import { Component, OnInit } from '@angular/core';

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

  countries = [
    {name: 'Nigeria', value: '234'},
    {name: 'South Africa', value: '24'},
    {name: 'Zimbabwe', value: '23'},
    {name: 'Algeria', value: '2'},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  submit(value) {
    console.log(value);
  }

  getCountry(country: string) {
    this.countryId = country;
    console.log(country);
  }
}
