import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AssetsService } from '../services/assets.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './buy-asset.component.html',
  styleUrls: ['./buy-asset.component.css']
})
export class BuyAssetComponent implements OnInit {
  assets: any;
  orderStrategy: any;
  assetChosen: any;
  amount: any;
  price: any;
  error: any;
  primaryMarket: any;
  secondaryMarket: any[];
  accountNumber: string;
  fullName: string;
  firstName: string;
  middleName: string;
  userId: string;
  balance: any;

  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    //this.hideArtDetails('hidden');
    this.accountNumber = localStorage.getItem('accountNumber');
    this.fullName = localStorage.getItem('firstName') + '' + localStorage.getItem('middleName');
    this.getAssets();
    this.getBalance();
  }

  getAssets() {
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          init.push(element);
        } else if (element.market === 1 && element.approved === 1) {
          second.push(element);
        }
      });
      this.primaryMarket =  init ;
      this.secondaryMarket = second;
      console.log('this is primary market', this.primaryMarket)
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => {
      this.assetService.stopSpinner();
     }
    );
  }

  buy(buyForm: NgForm) {
    console.log('this is form', buyForm);
    const price = buyForm.value.price;
    const amount = buyForm.value.amount;
    const body = {
        tokenId: 59908500,
        orderType: 0,
        orderStrategy: 0,
        amount: amount,
        "price": 150,
        "goodUntil": 0,
        "userId": 5
    }
    this.assetService.buyAsset(body).subscribe(data => {
      console.log('this is response', data);
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    })
  }

  view(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }

  getBalance() {
    this.assetService.showSpinner();
    this.userId = localStorage.getItem('userId');
    this.assetService.getWaletBalance(this.userId).subscribe(res => {
      console.log('this is balance', res);
      this.balance = res['data'];
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

  viewAll() {
    this.router.navigateByUrl('/assets', { state: {from: 'buyPage'}});;
  }

viewBuy(tokenId) {
  this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: 'buyPage'} });
}

}
