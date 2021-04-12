import { AdminService } from './../services/admin.service';
import { LoginService } from './../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AssetsService } from './../services/assets.service';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';


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
  currentButton = "first";
  balance: 0;
  secondaryPrice: any;
  orderId: any;
  quantity: any;
  showModal: boolean;
  balanceComplete: boolean;
  total: number;
  remainingShares: any;
  demoStrategy: { name: string,  code: number }[] = [
    { "name": 'Good Till Cancel',  code: 0 },
    { "name": 'All or Nothing',  code: 1 },
    { "name": 'Good Till Day',  code: 2 },
    { "name": 'Good Till Month',  code: 3 }
  ];
  shares: any;
  notLoggedIn: boolean;
  holidays: any;
  marketSettings: any;
  fees: any;
  image: any;
  form: FormGroup;

  constructor(public activatedRoute: ActivatedRoute, public assetService: AssetsService, public loginService: LoginService,
    public router: Router, public adminService: AdminService, public fb: FormBuilder) { 
      this.form = fb.group({
        'image': this.image
    });
    }

  ngOnInit(): void { 
    this.userId = localStorage.getItem('userId');
    if (this.userId === null || this.userId === undefined) {
      this.notLoggedIn = true;
    } else {
      this.notLoggedIn = false;
    }
    this.balanceComplete = false;
    this.assetService.getMetamaskInfo().then(data => {
      this.balance = data.balance;
    })
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.tokenId) {
                    console.log('this is what i got', window.history.state.tokenId)
                    this.tokenId = window.history.state.tokenId;
                    this.userId = parseInt(localStorage.getItem('userId'));
                    this.pageHistory = window.history.state.from;
                    this.secondaryPrice = window.history.state.price;
                    this.quantity = window.history.state.quantity;
                    if (window.history.state.id) {
                      this.orderId = window.history.state.id;
                    }
                    console.log('this is page history', this.pageHistory)
                    this.getAssets();
                    this.getFees();
                    this.getHolidays();
                    this.getMarketSettings();
                    this.getOwnedShares();
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

  getOwnedShares() {
    this.assetService.getOwnedShares(this.userId, this.tokenId).subscribe((res: any) => {
      console.log('this is response for shares', res);
      this.shares = res['data'];
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => { }
    );
  }

  getFees() {
    this.adminService.getFees().subscribe(res => {
      this.fees = res['data'];
    })
  }

  getMarketSettings() {
    this.adminService.getMarketSettings().subscribe(res => {
      this.marketSettings = res['data'];
    })
  }

  getHolidays() {
    this.adminService.getHolidays().subscribe( res => {
      this.holidays = res['data'];
    })
  }

  secBuy(amount, price) {

    if (this.shares = 0 ) {
      this.assetService.showNotification('top', 'center', 'You can not sell this asset as you currently own no shares in it', 'danger');
      return;
    }
    if (this.amount > this.shares ) {
      this.assetService.showNotification('top', 'center', 'You can not sell more than your total number of shares for this asset', 'danger');
      return;
    }

    if (!amount) {
      this.assetService.showNotification('top', 'center', 'Please confirm that you entered the quantity of assets you want to purchase', 'danger');
      return;
    }
    this.total = amount * this.asset.marketPrice;
    console.log('this is total', this.total)
    if (this.balance == 0 || this.balance < this.asset.marketPrice * amount + this.fees.nse + this.fees.transaction + this.fees.blockchain + this.fees.smsNotification) {
      this.balanceComplete = false;
      this.assetService.showNotification('top', 'center', 'You currently do not have enough in your account balance to purchase this asset', 'danger');
      return;
    } else if(this.balance >= this.asset.marketPrice * amount + this.fees.nse + this.fees.transaction + this.fees.blockchain + this.fees.smsNotification) {
      this.balanceComplete = true;
    }
    
  
    let body;
   
      body = {
        tokenId: this.asset.tokenId,
        orderType: 0,
        orderStrategy: 0,
        amount: amount,
        "price": price,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        market: 1
      }
   
    this.assetService.showSpinner();
    this.assetService.buyAsset(body).pipe(first()).subscribe(data => {
      console.log('this is response', data);
      if (data['status'] == 'success') {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'Order has been placed successfully', 'success');
        this.router.navigateByUrl('/home')
      } else {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'There has been an error while trying to place an order for this asset, please try again later', 'danger');
      }
      
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    })

  }
  

  buy(buyForm: NgForm) {
    // let orderStrategy;
    // var percentToGet = this.marketSettings.percMinBuyQuantity;
    // var nseFee = this.fees.nse;

    // console.log('this is amount', this.amount);
    //  console.log('this is amount', this.quantity);

    // if (this.quantity) {
    //   var percent = (percentToGet / 100) * this.quantity;
    // } else if (this.amount) {
    //   var percent = (percentToGet / 100) * this.amount;
    // }

    // var percentToGet = this.marketSettings.percMinBuyQuantity;

    // console.log('this is amount', this.amount);
    //  console.log('this is amount', this.quantity);

    // if (this.quantity) {
    //   var percent = (nseFee / 100) * this.quantity;
    // } else if (this.amount) {
    //   var percent = (nseFee / 100) * this.amount;
    // }

    // console.log('this is percentage', percent);

    // if (percent < this.marketSettings.percMinBuyQuantity) {
    //   this.assetService.showNotification('top', 'center', "The minimum buy quantity for this asset is set at " + this.marketSettings.percMinBuyQuantity + "%" + ", please update your order and try again.", 'danger');
    //   return;
    // }
    // if (!this.amount) {
    //   this.assetService.showNotification('top', 'center', 'Please confirm that you entered the quantity of assets you want to purchase', 'danger');
    //   return;
    // }
    // if (this.amount > this.remainingShares || this.quantity > this.remainingShares) {
    //   this.assetService.showNotification('bottom', 'center', 'You cannot purchase more than the available shares for this asset.', 'danger');
    //   return;
    // }
    // this.total = this.amount * this.asset.issuingPrice;
    // console.log('this is total', this.total)
    if (this.balance == 0 || this.balance < this.asset.issuingPrice  +  this.fees.transaction + this.fees.blockchain + this.fees.smsNotification) {
      this.balanceComplete = false;
      this.assetService.showNotification('top', 'center', 'You currently do not have enough in your account balance to purchase this asset', 'danger');
      return;
    } else if(this.balance >= this.asset.issuingPrice + this.fees.transaction + this.fees.blockchain + this.fees.smsNotification) {
      this.balanceComplete = true;
    }
    
    // if (this.asset.market === 0 ) {
    //   orderStrategy = 0;
    // } else {
    //   orderStrategy = parseInt(buyForm.value.orderStrategy);
    // }
    // if (this.amount > this.asset.sharesAvailable){
    //   this.assetService.showNotification('top', 'center', 'You cannot purchase more than the available shares', 'danger');
    //   return;
    // }
    let body;
    if (this.orderId) {
      body = {
        tokenId: this.asset.tokenId,
        orderType: 0,
        orderStrategy: 0,
        amount: 1,
        "price": this.secondaryPrice,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        "orderId": this.orderId,
        market: 1
      }
    } else {
      console.log('this is primary market')
      body = {
        tokenId: this.asset.tokenId,
        orderType: 0,
        orderStrategy: 0,
        amount: 1,
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

  sell(sellForm: NgForm) {
    console.log('this is price', this.price);
    if (!this.amount) {
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', 'Please confirm you have entered the quantity for this purchase.', 'danger');
      return;
    }
    this.assetService.showSpinner();
    this.price = sellForm.value.price;
    if (this.asset.market === 0) {
      this.assetService.stopSpinner();
      this.assetService.showNotification('top', 'center', 'You cannot sell this asset as it is still listed on the primary market.', 'danger');
      return
    }
    
    const body = {
        tokenId: this.asset.tokenId,
        orderType: 1,
        orderStrategy: 0,
        amount: this.amount,
        "price": this.price,
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
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

 

  viewBuy(tokenId, page) {
    this.pageHistory = 'buyPage'
    this.tokenId = tokenId;
    this.getAssetDetails()
  }

  // getBalance() {
  //   this.assetService.showSpinner();
  //   this.userId = localStorage.getItem('userId');
  //   this.assetService.getWaletBalance(this.userId).subscribe(res => {
  //     console.log('this is balance', res);
  //     this.balance = res['data'];
  //   }, err => {
  //     console.log(err.error.data.error);
  //     this.error = err.error.data.error;
  //     this.assetService.showNotification('bottom', 'center', this.error, 'danger')
  //   });
  // }

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
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

  
  sendMarketOrder() {
    console.log('this is amount', this.amount)

    let orderType;
    let market;
    if (this.balance < this.asset.marketPrice * this.amount + this.fees.transaction + this.fees.blockchain + this.fees.smsNotification) {
      this.assetService.showNotification('bottom', 'center', 'You currently do not have enough balance to buy at this price, please fund your wallet and try again.', 'danger');
      return;
     
    } else if (this.balance >= this.asset.marketPrice * this.amount + this.fees.transaction + this.fees.blockchain + this.fees.smsNotification)  {
      orderType = 0;
      market = 1;
    }

    // if (this.amount > this.remainingShares) {
    //   this.assetService.stopSpinner();
    //   this.assetService.showNotification('bottom', 'center', 'You can not buy more than the remaining shares for this asset.', 'danger');
    //   return;
    // }
    this.assetService.showSpinner();
    if (!this.amount) {
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', 'Please confirm you have entered the quantity for this purchase.', 'danger');
      return;
    }

    // this.orderStrategy = 0;
    let body;
   
      body = {
        tokenId: this.asset.tokenId,
        orderType: orderType,
        orderStrategy: 4,
        amount: this.amount,
        "price": 0,
        "goodUntil": 0,
        "userId": parseInt(this.userId),
        "orderId": this.orderId,
        market: market
      }
    
      this.assetService.buyAsset(body).pipe(first()).subscribe(data => {
        console.log('this is response', data);
        if (data['status'] == 'success') {
          this.assetService.stopSpinner();
          this.assetService.showNotification('bottom', 'center', 'Order has been placed successfully', 'success');
          this.router.navigateByUrl('/home')
        } else {
          this.assetService.stopSpinner();
          this.ngOnInit();
          this.assetService.showNotification('bottom', 'center', 'There has been an error while trying to place an order for this asset, please try again later', 'danger');
        }
        
      }, err => {
        console.log(err.error.data.error);
        this.error = err.error.data.error;
        this.assetService.stopSpinner();
        this.assetService.showNotification('bottom', 'center', this.error, 'danger')
      })
    }

    uploadFile(event: any) {

      const file = (event.target as HTMLInputElement).files[0];
      if ( /\.(jpe?g|gif|png)$/i.test(file.name) === false  ) {
        this.asset.showNotification('bottom', 'center', 'please choose an Image!', 'danger')
        event.srcElement.value = null;
      } else {
        this.form.patchValue({
        image: file
      });
      this.form.get('image').updateValueAndValidity();
      }
  
      const reader = new FileReader();
              reader.onload = (e: any) => {
                  const image = new Image();
                  image.src = e.target.result;
                  image.onload = rs => {
                      const img_height = rs.currentTarget['height'];
                      const img_width = rs.currentTarget['width'];
  
                      console.log(img_height, img_width);
  
  
                      
                          const imgBase64Path = e.target.result;
                          this.image = imgBase64Path;
                          console.log('this is image path', imgBase64Path)
                          // this.previewImagePath = imgBase64Path;
                  };
              };
  
              reader.readAsDataURL(event.target.files[0]);
    }
  

}
