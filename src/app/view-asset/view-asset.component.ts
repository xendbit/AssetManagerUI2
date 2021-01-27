import { LoginService } from './../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { AssetsService } from './../services/assets.service';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-view-asset',
  templateUrl: './view-asset.component.html',
  styleUrls: ['./view-asset.component.scss']
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
  approved: any[];
  unapproved: any[];
  balance: any;
  secondaryPrice: any;
  orderId: any;


  constructor(public activatedRoute: ActivatedRoute, public assetService: AssetsService, public loginService: LoginService,
    public router: Router) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId'));
    this.getBalance();
    this.getAssets();
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.tokenId) {
                    console.log('this is what i got', window.history.state.tokenId)
                    this.tokenId = window.history.state.tokenId;
                    this.pageHistory = window.history.state.from;
                    this.secondaryPrice = window.history.state.price;
                    if (window.history.state.id) {
                      this.orderId = window.history.state.id;
                    }
                    console.log('this is page history', this.pageHistory)
                    this.getAssetDetails();
                }
            },
            err => {
                console.log(err);
            },
            () => { }
        );
  }

  getAssetDetails() {
    this.assetService.showSpinner();
    this.assetService.getAssetsByTokenId(this.tokenId).pipe(first()).subscribe(data => {
      console.log('this is data for asset', data);
      this.asset = data['data'];
      this.assetService.stopSpinner()
    }, err => {
      this.assetService.stopSpinner();
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      //this.asset.showNotification('bottom', 'center', this.error, 'danger')
    })
  }

  getAssets() {
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.approved === 0 ) {
          init.push(element);
        } else if (element.approved === 1) {
          second.push(element);
        }
      });
      this.approved =  second ;
      console.log('this is approved', this.approved)
      this.unapproved = init;
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      //this.asset.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

  buy(buyForm: NgForm) {
    let orderStrategy;
    console.log('this is balance', this.balance);
    if (this.balance == 0) {
      this.assetService.showNotification('top', 'center', 'You currently do not have enough in your account balance to purchase this asset', 'danger');
      return;
    }
    
    if (this.asset.market === 0 ) {
      orderStrategy = 0;
    } else {
      orderStrategy = buyForm.value.orderStrategy
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
        amount: this.amount,
        "price": this.secondaryPrice,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        "orderId": this.orderId
      }
      console.log('this is body', body)
    } else {
      body = {
        tokenId: this.asset.tokenId,
        orderType: 0,
        orderStrategy: orderStrategy,
        amount: this.amount,
        "price": this.asset.issuingPrice,
        "goodUntil": 0,
        "userId": parseInt(this.userId)
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
      this.asset.showNotification('bottom', 'center', this.error, 'danger')
    })
  }

  sell(sellForm: NgForm, tokenId) {
    console.log('this is form', sellForm);
    const price = sellForm.value.price;
    const amount = sellForm.value.amount;
    const orderStrategy = parseInt(sellForm.value.orderStrategy);
    const body = {
        tokenId: this.asset.tokenId,
        orderType: 1,
        orderStrategy: orderStrategy,
        amount: this.amount,
        "price": price,
        "goodUntil": 0,
        "userId": parseInt(this.userId)
    }
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
    this.tokenId = tokenId;
    this.getAssetDetails()
  }

  getBalance() {
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
