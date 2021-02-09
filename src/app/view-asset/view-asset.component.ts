import { LoginService } from './../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AssetsService } from './../services/assets.service';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-view-asset',
  templateUrl: './view-asset.component.html',
  styleUrls: ['./view-asset.component.css']
})
export class ViewAssetComponent implements OnInit {
  tokenId: any;
  asset: any;
  orderStrategy: any;
  amount: any;
  price: any;
  error: any;
  pageHistory: any;
  userId: any;
  @Input() editable: boolean = false;
  assets: any;
  primaryMarket: any[];

  balance: 0;
  secondaryPrice: any;
  orderId: any;
  quantity: any;
  showModal: boolean;
  balanceComplete: boolean;
  total: number;
  remainingShares: any;

  constructor(public activatedRoute: ActivatedRoute, public assetService: AssetsService, public loginService: LoginService,
    public router: Router) { }

  ngOnInit(): void { 
    this.userId = parseInt(localStorage.getItem('userId'));
    this.balanceComplete = false;
    this.getBalance();
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.tokenId) {
                    console.log('this is what i got', window.history.state.tokenId)
                    this.tokenId = window.history.state.tokenId;
                    this.pageHistory = window.history.state.from;
                    this.secondaryPrice = window.history.state.price;
                    this.quantity = window.history.state.quantity;
                    if (window.history.state.id) {
                      this.orderId = window.history.state.id;
                    }
                    console.log('this is page history', this.pageHistory)
                    this.getAssets();
                    this.getAssetDetails();
                    this.getPrimarySharesRemaining(this.tokenId);
                }
            },
            err => {
                console.log(err);
            },
            () => { }
        );
  }

  getAssetDetails() {
    this.assetService.getAssetsByTokenId(this.tokenId).pipe(first()).subscribe(data => {
      console.log('this is data for asset', data);
      this.asset = data['data'];
      this.assetService.stopSpinner()
    }, err => {
      this.assetService.stopSpinner();
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      //this.asset.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          init.push(element);
        } else if (element.market === 1) {
          second.push(element);
        }
      });
      this.primaryMarket =  init ;
      this.assetService.stopSpinner();
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      //this.asset.showNotification('bottom', 'center', this.error, 'danger')
    });
  }
  

  buy(buyForm: NgForm) {
    let orderStrategy;
    this.amount = parseInt(this.amount);
    this.quantity = parseInt(this.quantity);
    console.log('this is amount', this.amount > this.asset.sharesAvailable);
    if (!this.amount || this.quantity) {
      this.assetService.showNotification('top', 'center', 'Please confirm that you entered the quantity of assets you want to purchase', 'danger');
      return;
    }
    if (this.amount > this.remainingShares || this.quantity > this.remainingShares) {
      this.assetService.showNotification('bottom', 'center', 'You cannot purchase more than the available shares for this asset.', 'danger');
      return;
    }
    this.total = this.amount * this.asset.issuingPrice;
    console.log('this is total', this.total)
    if (this.balance == 0 || this.balance < this.asset.issuingPrice * this.amount) {
      this.balanceComplete = false;
      this.assetService.showNotification('top', 'center', 'You currently do not have enough in your account balance to purchase this asset', 'danger');
      return;
    } else if(this.balance >= this.asset.issuingPrice * this.asset.sharesAvailable) {
      this.balanceComplete = true;
    }
    
    if (this.asset.market === 0 ) {
      orderStrategy = 0;
    } else {
      orderStrategy = parseInt(buyForm.value.orderStrategy);
    }
    if (this.amount > this.asset.sharesAvailable){
      this.assetService.showNotification('top', 'center', 'You cannot purchase more than the available shares', 'danger');
      return;
    }
    let body;
    if (this.orderId) {
      body = {
        tokenId: this.asset.tokenId,
        orderType: 0,
        orderStrategy: orderStrategy,
        amount: this.quantity,
        "price": this.secondaryPrice,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        "orderId": this.orderId,
        market: 1
      }
      console.log('this is body', body)
    } else {
      console.log('this is primary market')
      body = {
        tokenId: this.asset.tokenId,
        orderType: 0,
        orderStrategy: orderStrategy,
        amount: this.amount,
        "price": this.asset.issuingPrice,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        market: 0
      }
      console.log('this is body', body)
    }
   
    this.assetService.showSpinner();
    this.assetService.buyAsset(body).pipe(first()).subscribe(data => {
      console.log('this is response', data);
      if (data['status'] == 'success') {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'Asset has been bought successfully', 'success');
        this.router.navigateByUrl('/home')
      } else {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'There has been an error while trying to purchase this asset, please try again later', 'danger');
      }
      
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    })
  }

  sell(sellForm: NgForm, tokenId) {
    this.assetService.showSpinner();
    console.log('this is form', sellForm);
    const price = sellForm.value.price;
    const amount = sellForm.value.amount;
    if (this.asset.market === 0) {
      this.assetService.stopSpinner();
      this.assetService.showNotification('top', 'center', 'You cannot sell this asset as it is still listed on the primary market.', 'danger');
      return
    }
    const orderStrategy = parseInt(sellForm.value.orderStrategy);
    const body = {
        tokenId: this.asset.tokenId,
        orderType: 1,
        orderStrategy: orderStrategy,
        amount: this.amount,
        "price": price,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        market: 1
    }
    this.assetService.stopSpinner();
    this.assetService.showSpinner();
    this.assetService.buyAsset(body).pipe(first()).subscribe(data => {
      if (data['status'] == 'success') {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'Asset has been sold successfully', 'success');
        this.router.navigateByUrl('/home')
      } else {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'There was an error while trying to sell this asset, please try again later', 'danger');
      }
      console.log('this is response', data);
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.asset.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

 

  viewBuy(tokenId, page) {
    this.pageHistory = 'buyPage'
    this.tokenId = tokenId;
    this.getAssetDetails()
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
      this.asset.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

  getPrimarySharesRemaining(tokenId) {
    this.loginService.checkSharesRemaining(tokenId).pipe(first()).subscribe(res => {
      console.log('this is remaining shares', res);
      this.remainingShares = res['data'];
    })
  }

  approve(tokenId, status) {
    this.assetService.showSpinner();
    this.loginService.approve(tokenId, status).subscribe(res => {
      console.log('this is response', res);
      if (res['status'] === 'success') {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'Asset has been approved successfully', 'success');
        this.router.navigateByUrl('/admin-dashboard');
      } else {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'There was an error while trying to approve this asset, confirm the issuer has enough gas and try again later.', 'danger');
      }
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.asset.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

  

}
