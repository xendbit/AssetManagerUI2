import { Component, OnInit, Input } from '@angular/core';
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
  asset: any;
  tokenId: any;
  sellOrders: any;
  unavailable: boolean;
  @Input() editable: boolean = false;
  userId: any;
  balance: 0;
  amount: any;
  primaryMarket: any[];
  secondaryMarket: any[];
  quantity: any;
  balanceComplete: boolean;
  orderId: any;
  secondaryPrice: any;
  orderStrategy: any;
  price: any;
  fromOrder: boolean;
  currentButton = "first";
  buyOrders: any[];
  fromSellOrder: boolean;
  shares: any;

  constructor(public assetService: AssetsService, public router: Router, public adminService: AdminService,
    public loginService: LoginService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.balanceComplete = false;
    this.userId = parseInt(localStorage.getItem('userId'));
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.tokenId) {
                    console.log('this is what i got', window.history.state.tokenId)
                    this.tokenId = window.history.state.tokenId;
                    this.getSellOrders();
                    this.getBalance();
                    this.getOwnedShares();
                    this.getAssetDetails();
                    this.getAssets();
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

getOwnedShares() {
  this.assetService.getOwnedShares(this.userId, this.tokenId).subscribe((res: any) => {
    console.log('this is response for shares', res);
    this.shares = res['data'];
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
          last.push(element);
        }
      });

      console.log('this is slast', last);
      
      this.sellOrders = second;
      this.buyOrders = last;
      this.assetService.stopSpinner();
      console.log('this is data', this.sellOrders);
      })
}

  view(tokenId) {
    this.tokenId = tokenId;
    this.getSellOrders();
  }

  viewAsset(price, id, amount) {
    this.assetService.showSpinner();
    this.quantity = amount;
    this.secondaryPrice = price;
    this.orderId = id;
    this.fromOrder = true;
    this.assetService.stopSpinner();
    //this.router.navigateByUrl('/viewAsset', { state : {tokenId: this.tokenId, from: 'secPage', price: price, id: id, quantity: amount} });
  }

  viewAssetSell(price, id, amount) {
    this.assetService.showSpinner();
    this.secondaryPrice = price;
    this.orderId = id;
    this.fromSellOrder = true;
    this.assetService.fetchOrderById(this.orderId).subscribe( (res: any) => {
      console.log('this is order, ', res);
      if (parseInt(res['data']['amountRemaining']) === 0) {
        this.assetService.showNotification('top', 'center', 'Unfortunately this order has been filled', 'danger');
      } else {
        this.quantity = res['data']['amountRemaining'];
      }
    })
    this.assetService.stopSpinner();
    //this.router.navigateByUrl('/viewAsset', { state : {tokenId: this.tokenId, from: 'secPage', price: price, id: id, quantity: amount} });
  }

  sell(sellForm: NgForm, tokenId) {
    console.log('this is form', sellForm);
    const body = {
        tokenId: this.asset.tokenId,
        orderType: 1,
        orderStrategy: 0,
        amount: this.quantity,
        "price": this.secondaryPrice,
        orderId: this.orderId,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        market: 1
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

 



  buy(buyForm: NgForm) {
    this.assetService.showSpinner();
    let orderStrategy;
    if (!this.quantity) {
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', 'Please confirm you have entered the quantity for this purchase.', 'danger');
      return;
    }
    if (!this.fromOrder) {
      if (this.balance == 0 || this.balance < this.secondaryPrice * this.asset.sharesAvailable) {
        console.log('this is not from order')
        this.balanceComplete = false;
        this.assetService.stopSpinner();
        this.assetService.showNotification('bottom', 'center', 'You currently do not have enough in your account balance to purchase this asset', 'danger');
        return;
      } else if(this.balance >= this.secondaryPrice * this.asset.sharesAvailable) {
        this.balanceComplete = true;
      }
    } else if (this.fromOrder) {
      if (this.balance == 0 || this.balance < this.secondaryPrice * this.asset.sharesAvailable) {
        console.log('this is from order')
        this.fromOrder = null;
        this.balanceComplete = false;
        this.assetService.stopSpinner();
        this.assetService.showNotification('bottom', 'center', 'You currently do not have enough in your account balance to purchase this asset', 'danger');
        return;
      } else if(this.balance >= this.asset.issuingPrice * this.asset.sharesAvailable) {
        this.balanceComplete = true;
      }
    }
    
    
    if (this.asset.market === 0 ) {
      orderStrategy = 0;
    } else {
      orderStrategy = parseInt(buyForm.value.orderStrategy);
    }
    if (this.quantity > this.asset.sharesAvailable){
      this.assetService.showNotification('bottom', 'center', 'You cannot purchase more than the available shares', 'danger');
      this.assetService.stopSpinner();
      return;
    }
    console.log('got here')
    let body;
   
      body = {
        tokenId: this.asset.tokenId,
        orderType: 0,
        orderStrategy: orderStrategy,
        amount: this.quantity,
        "price": this.secondaryPrice,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        "orderId": this.orderId,
        market: 2
      }
  
    this.assetService.buyAsset(body).pipe(first()).subscribe(data => {
      console.log('this is response', data);
      if (data['status'] == 'success') {
        this.assetService.stopSpinner();
        this.assetService.showNotification('bottom', 'center', 'Asset has been bought successfully', 'success');
        this.router.navigateByUrl('/home')
      } else {
        this.assetService.stopSpinner();
        this.ngOnInit();
        this.assetService.showNotification('bottom', 'center', 'There has been an error while trying to purchase this asset, please try again later', 'danger');
      }
      
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    })
  }



}
