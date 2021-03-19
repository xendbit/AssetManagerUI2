import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminService } from './../services/admin.service';
import { AssetsService } from './../services/assets.service';
import { NgForm } from '@angular/forms';

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
  newHolidayName: any;
  updateHolidayStart: any;
  updateHolidayEnd: any;
  updateHolidayDetails: any;

  dynamicHolidays: { name: string,  day: string, id: number }[] = [
    { "name": 'Good Friday',  day: "2 Apr", id: 7 },
    { "name": '	Easter Monday',  day: "5 Apr", id: 8},
    { "name": 'Id el Fitr',  day: "13  May", id: 9},
    { "name": 'Id el Fitr holiday',  day: "14 May", id: 10},
    { "name": '	Id el Kabir',  day: "20 Jul", id: 11 },
    { "name": 'Id el Kabir additional holiday',  day: "21 Jul", id: 12},
    { "name": 'Id el Maulud',  day: "19 Oct", id: 13},
  ];

  investor: boolean;
  firstName: any;
  lastName: any;
  email: any;
  phone: any;
  disabledId: any;
  fees: any;
  marketSettings: any;
  paystackKey: any;
  holidays: any;
  error: any;
  initHoliday: any[];
  initHolId: any;
  issuers: any;
  investors: any;
  admins: any;
  userEmail: any;

  constructor(public adminService: AdminService, public assetsService: AssetsService, public router: Router) { }

  ngOnInit(): void {
    this.getFees();
    this.getMarketSettings();
    this.getHolidays();
    this.getInvestors();
    this.getAdmins();
    this.getIssuers();

  }

  getFees() {
    this.adminService.getFees().subscribe(res => {
      this.fees = res['data'];
      this.nseFee = this.fees.nse
    })
  }

  getAdmins() {
    this.adminService.getAllUsers(1).subscribe(res => {
      console.log('this is admin', res);
      this.admins = res['data'];
    })
  }

  getInvestors() {
    this.adminService.getAllUsers(0).subscribe( res => {
      console.log('this is investor', res);
      this.investors = res['data'];
    })
  }

  getIssuers() {
    this.adminService.getAllUsers(2).subscribe( res => {
      console.log('this is issuer', res);
      this.issuers = res['data'];
    })
  }

  getMarketSettings() {
    this.adminService.getMarketSettings().subscribe(res => {
      this.marketSettings = res['data'];
    })
  }

  initSetNewHolidayData(id, name) {
   this.initHoliday = name;
   this.initHolId = id
  }

  getHolidays() {
    this.adminService.getHolidays().subscribe( res => {
      this.holidays = res['data'];
    })
  }

  updateHoliday(updateHolidayForm: NgForm) {
    console.log('this is it', updateHolidayForm.value);
    console.log('this is that', this.updateHolidayEnd)

  }

  view(id, firstName, lastName, email, phone, role) {
    console.log('i am clicked')
    this.investor = true;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userEmail = email;
    this.phone = phone;

    this.router.navigateByUrl('/view-users', {state : {firstName: firstName, id: id, lastName: lastName, email: email, role: role}})
  }


  delete(Id) {
    console.log('this is order', Id);
    this.disabledId = Id;
  }

  updateFees(feeForm: NgForm) {
    if (feeForm.value.smsFee !== undefined && feeForm.value.nseFee === undefined ||feeForm.value.smsFee !== undefined && feeForm.value.transactionFee === undefined || feeForm.value.smsFee !== undefined && feeForm.value.blockchainFee === undefined ) {
      this.smsFee = feeForm.value.smsFee;
      this.nseFee = this.fees.nse;
      this.transactionFee = this.fees.transaction;
      this.blockchainFee = this.fees.blockchain;
    } else if (feeForm.value.nseFee !== undefined && feeForm.value.smsFee === undefined ||feeForm.value.nseFee !== undefined && feeForm.value.transactionFee === undefined || feeForm.value.nseFee !== undefined && feeForm.value.blockchainFee === undefined ){
      this.smsFee = this.fees.smsNotification;
      this.transactionFee = this.fees.transaction;
      this.blockchainFee = this.fees.blockchain;
    } else if (feeForm.value.blockchainFee !== undefined && feeForm.value.smsFee === undefined ||feeForm.value.blockchainFee !== undefined && feeForm.value.transactionFee === undefined || feeForm.value.smsFee !== undefined && feeForm.value.nseFee === undefined ) {
      this.smsFee = this.fees.smsNotification;
      this.transactionFee = this.fees.transaction;
      this.nseFee = this.fees.nse;
    } else if (feeForm.value.transactionFee !== undefined && feeForm.value.smsFee === undefined ||feeForm.value.transactionFee !== undefined && feeForm.value.nseFee === undefined || feeForm.value.smsFee !== undefined && feeForm.value.blockchainFee === undefined ) {
      this.smsFee = this.fees.smsNotification;
      this.blockchainFee = this.fees.blockchain;
      this.nseFee = this.fees.nse;
    }
   
    if (this.smsFee === undefined && this.transactionFee === undefined && this.blockchainFee === undefined && this.nseFee === undefined) {
      this.assetsService.showNotification('top', 'center','You have not updated any fee.', 'danger');
      return;
    }

    this.assetsService.showSpinner();
    this.adminService.updateFees(this.smsFee, this.nseFee, this.transactionFee, this.blockchainFee).subscribe(res => {
      if (res['status'] === 'success') {
        this.getFees();
        this.assetsService.stopSpinner();
        this.assetsService.showNotification('top', 'center','Fees have been updated successfully', 'success');
      } else {
        this.assetsService.stopSpinner();
      }
    }, err => {
    console.log(err.error.data.error);
    this.error = err.error.data.error;
    this.assetsService.stopSpinner();
    this.assetsService.showNotification('bottom', 'center', this.error, 'danger')
  })

  }

  updateMarketSettings(marketForm: NgForm) {
    if (marketForm.value.quantity !== undefined && marketForm.value.priceLimit === undefined ||marketForm.value.quantity !== undefined && marketForm.value.holdingPeriod === undefined || marketForm.value.quantity !== undefined && marketForm.value.infinity === undefined ) {
      this.priceLimit = this.marketSettings.percPriceChangeLimit;
      this.holdingPeriod = this.marketSettings.primaryMarketHoldingPeriod;
      this.infinity = this.marketSettings.maxNoOfDaysForInfinityOrders;
    } else if (marketForm.value.priceLimit !== undefined && marketForm.value.quantity === undefined ||marketForm.value.priceLimit !== undefined && marketForm.value.holdingPeriod === undefined || marketForm.value.priceLimit !== undefined && marketForm.value.infinity === undefined ){
      this.quantity = this.marketSettings.percMinBuyQuantity;
      this.holdingPeriod = this.marketSettings.primaryMarketHoldingPeriod;
      this.infinity = this.marketSettings.maxNoOfDaysForInfinityOrders;
    } else if (marketForm.value.holdingPeriod !== undefined && marketForm.value.quantity === undefined ||marketForm.value.holdingPeriod !== undefined && marketForm.value.priceLimit === undefined || marketForm.value.holdingPeriod !== undefined && marketForm.value.infinity === undefined ) {
      this.quantity = this.marketSettings.percMinBuyQuantity;
      this.priceLimit = this.marketSettings.percPriceChangeLimit;
      this.infinity = this.marketSettings.maxNoOfDaysForInfinityOrders;
    } else if (marketForm.value.infinity !== undefined && marketForm.value.quantity === undefined ||marketForm.value.infinity !== undefined && marketForm.value.priceLimit === undefined || marketForm.value.infinity !== undefined && marketForm.value.holdingPeriod === undefined ) {
      this.quantity = this.marketSettings.percMinBuyQuantity;
      this.priceLimit = this.marketSettings.percPriceChangeLimit;
      this.holdingPeriod = this.marketSettings.primaryMarketHoldingPeriod;
    }
   
    if (this.quantity === undefined && this.priceLimit === undefined && this.holdingPeriod === undefined && this.infinity === undefined) {
      this.assetsService.showNotification('top', 'center','You have not updated the market settings.', 'danger');
      return;
    }

    this.assetsService.showSpinner();
    this.adminService.updateMarketSettings(this.quantity, this.priceLimit, this.holdingPeriod, this.infinity).subscribe(res => {
      if (res['status'] === 'success') {
        this.getMarketSettings();
        this.assetsService.stopSpinner();
        this.assetsService.showNotification('top', 'center','Settings have been updated successfully', 'success');
      } else {
        this.assetsService.stopSpinner();
      }
    }, err => {
    console.log(err.error.data.error);
    this.error = err.error.data.error;
    this.assetsService.stopSpinner();
    this.assetsService.showNotification('bottom', 'center', this.error, 'danger')
  })

  }

}
