import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  smsFee: any;
  nseFee: any;
  transactionFee: any;
  blockchainFee: any;
  quantity: any;
  priceLimit: any;
  holdingPeriod: any;
  infinity: any;
  currentButton = "first";

  staticHolidays: { name: string,  day: string }[] = [
    { "name": "New Year's Day",  day: "1 Jan" },
    { "name": "Workers' Day",  day: "1 May" },
    { "name": 'Democracy Day',  day: "12 Jun" },
    { "name": '	Independence Day',  day: "1 Oct" },
    { "name": '	Christmas Day',  day: "25 Dec" },
    { "name": 'Boxing Day',  day: "26 Dec" }
  ];

  dynamicHolidays: { name: string,  day: string }[] = [
    { "name": 'Good Friday',  day: "2 Apr" },
    { "name": '	Easter Monday',  day: "5 Apr" },
    { "name": 'Id el Fitr',  day: "13  May" },
    { "name": 'Id el Fitr holiday',  day: "14 May" },
    { "name": '	Id el Kabir',  day: "20 Jul" },
    { "name": 'Id el Kabir additional holiday',  day: "21 Jul" },
    { "name": 'Id el Maulud',  day: "19 Oct" },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
