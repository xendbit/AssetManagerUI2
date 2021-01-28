import { Component, OnInit } from '@angular/core';
import { LoginService } from './../services/login.service';
import { AdminService } from './../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from './../services/assets.service';
import { first } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  assets: any;
  error: any;
  assetChosen: any;
  unapproved: any[];
  approved: any[];
  asset: any;
  tokenId: any;
  sellOrders: any;
  unavailable: boolean;
  userId: any;
  balance: 0;
  amount: any;
  primaryMarket: any[];
  secondaryMarket: any[];

  constructor(public assetService: AssetsService, public router: Router, public adminService: AdminService,
    public loginService: LoginService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId'));
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.tokenId) {
                    console.log('this is what i got', window.history.state.tokenId)
                    this.tokenId = window.history.state.tokenId;
                    this.getSellOrders();
                    this.getBalance();
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
    })

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
  
    const body = {
      tokenId: this.asset.tokenId,
      orderType: 0,
      orderStrategy: 4,
      amount: this.amount,
      "price": 0,
      "goodUntil": 0,
      "userId": parseInt(this.userId)
    }
    console.log('this is body', body)
 
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


getSellOrders() {
  this.assetService.showSpinner();
    this.assetService.ordersByTokenId(this.tokenId).subscribe(sell => {
      console.log('these are orders', sell);
      const assets = sell['data']['items'];
      let second = []
      let last = [];
      assets.forEach(element => {
        console.log('this is order type', element.orderType);
        if (element.orderType == 1 ) {
          second.push(element);
        } else {
          last.push();
        }
      });

      console.log('this is slast', last);
      
      this.sellOrders = second;
      this.assetService.stopSpinner();
      console.log('this is data', this.sellOrders);
      })
}

  view(tokenId) {
    this.tokenId = tokenId;
    this.getSellOrders();
  }

  viewAsset(price, id, amount) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: this.tokenId, from: 'secPage', price: price, id: id, quantity: amount} });
  }

}
