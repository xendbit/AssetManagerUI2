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

  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    //this.hideArtDetails('hidden');
    this.accountNumber = localStorage.getItem('accountNumber');
    this.fullName = localStorage.getItem('firstName') + localStorage.getItem('middleName');
    this.getAssets();
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
    })
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
      this.showNotification('bottom', 'center', this.error, 'danger')
    })
  }

  view(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }

  viewAll() {
    this.router.navigateByUrl('/assets', { state: {from: 'buyPage'}});;
  }

showNotification(from, align, message, kind){
  const type = ['','info','success','warning','danger'];

  const color = Math.floor((Math.random() * 4) + 1);

  $.notify({
      icon: "notifications",
      message: message

  },{
      type: kind,
      timer: 4000,
      placement: {
          from: from,
          align: align
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>'
  });
}

viewBuy(tokenId) {
  this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: 'buyPage'} });
}

}
