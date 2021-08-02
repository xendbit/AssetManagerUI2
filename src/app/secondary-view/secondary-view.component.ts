import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../services/login.service';
import { AdminService } from '../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { first } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import * as Web3 from 'web3';
import { ViewChild } from '@angular/core';



declare let require: any;
declare let window: any;

@Component({
  selector: 'app-secondary-view',
  templateUrl: './secondary-view.component.html',
  styleUrls: ['./secondary-view.component.css']
})
export class SecondaryViewComponent implements OnInit {
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
  myBuyOrders: any;
  mySellOrders: any;
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: number;
  country: string;
  zipCode: number;
  city: string;
  state: string;
  street: any;
  houseNumber: string;
  bids: any[];
  remainingShares: number;
  blockchainAddress: any;
  notLoggedIn: boolean;
  loading: boolean;
  submitted: boolean;
  fees: any;
  marketSettings: any;
  holidays: any;
  accounts: any;
  displayedData: string;
  account: any;
  metamask: any;
  hasMetaMask: boolean;
  assetMedia: any;
  auctionId: number;
  auction: any;
  auctionStart: Date;
  auctionEnd: Date;
  sellNowPrice: number;
  imageObject: any[] = [];
  userAgent: string;
  tempImage: string;
  modalElement: HTMLElement;
  response: any;

  constructor(public assetService: AssetsService, public router: Router, public adminService: AdminService,
    public loginService: LoginService, public activatedRoute: ActivatedRoute) {
    
     }

  async ngOnInit(): Promise<void> {
    var ua = navigator.userAgent;
    let element: HTMLElement = document.getElementById('openModal') as HTMLElement;
    this.modalElement = element;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.userAgent = 'mobile';
    } else if(/Chrome/i.test(ua)) {
      this.userAgent = 'chrome';
    } else {
      this.userAgent = 'desktop';
    }
    this.assetService.getMetamaskInfo().then( data => {
      this.balance = data.balance;
      this.account = data.account;
    })
    this.tempImage = '/assets/img/nft.png';
    this.checkBuyer();
    this.activatedRoute.paramMap
      .subscribe(
        () => {
          if (window.history.state.tokenId) {
            this.assetService.showSpinner();
              this.tokenId = window.history.state.tokenId;
              this.getAssetDetails();
              this.getAssets();
          } else {
            this.router.navigateByUrl('/home');
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
      this.asset = data['data'];
      this.auctionId = this.asset.lastAuctionId;
      this.getAuctionInfo();
      this.asset.media.filter(y => {
        if (y.mediaKey ==='mp4'){
         this.imageObject.push({video: y.media, mediaKey: y.mediaKey})
        } else if (y.mediaKey ==='image') {
         this.imageObject.push({image: y.media, title: this.asset.name, thumbImage: y.media, alt: this.asset.name, mediaKey: y.mediaKey })
        }
     })[0];
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => {
     }
    );
  }

  getAuctionInfo() {
    this.assetService.getAuctionInfo(this.asset.tokenId, this.auctionId).subscribe(res => {
      this.auction = res['data'];
      this.auctionStart = new Date(this.auction['startDate'])
      this.auctionEnd = new Date(this.auction['endDate']);
      this.sellNowPrice = parseInt(this.auction['sellNowPrice'])
      this.auction['bids'].sort((a, b) => (a.bid > b.bid ? -1 : 1)); // sort array of bids from highest downwards
    })
  }


  register(register: NgForm) {
    const email = register.value.email;
    const firstName = register.value.firstName;
    const middleName = register.value.middleName;
    const lastName = register.value.lastName;
    const phone = register.value.phone;
    const country = register.value.country;
    const zipCode = register.value.zipCode;
    const state = register.value.state;
    const city = register.value.city;
    const street = register.value.street;
    const houseNumber = register.value.houseNumber;
    const blockchainAddress = register.value.blockchainAddress;
    if (email === undefined || phone === undefined  || firstName === undefined || middleName === undefined || 
      lastName === undefined  || blockchainAddress === undefined || country === undefined ||
      zipCode === undefined || state === undefined || city === undefined || street === undefined || houseNumber === undefined) {
      this.assetService.showNotification('top', 'center', "Please make sure all fields are completed and correct.", 'danger');
      this.modalElement.click();
      
      return false;
    }
    // this.assetService.showSpinner();
    // this.assetService.saveBuyer(email, phone, firstName, lastName, middleName, blockchainAddress,
    //   country, zipCode, state, city, street, houseNumber).subscribe(res => {
    //   console.log('==>', res);
    //   if (res['status'] === 'success') {
    //     this.assetService.stopSpinner();
    //     this.assetService.showNotification('top', 'center', 'Buyer has been successfully registered', 'success');
    //   }
    // }, err => {
    //   console.log(err.error.data.error);
    //   this.error = err.error.data.error;
    //   this.assetService.stopSpinner();
    //   this.assetService.showNotification('top', 'center', this.error, 'danger');
    // })
  }

  withdraw() {
    this.assetService.showSpinner();
    this.assetService.withdraw(this.asset.tokenId, this.auctionId).then( res => {
      this.assetService.stopSpinner();
      this.assetService.stopSpinner();
    })
  }

  listTokenAuctions() {
    this.assetService.listAuctionByTokenId(this.tokenId).subscribe(res => {
    
      let info = res['data']['items'][0];
      // let startBlock = this.currentBlock + (x * 24 * 60 * 60)/3);
      // let endBlock = this.currentBlock + (y * 24 * 60 * 60)/3) ;
      let currentBlock = parseInt(info.currentBlock)
      console.log('this is current block', currentBlock)
      let day = (24 * 60 * 60)/3;
      let start = parseInt(info.startBlock);
      let startBlock = ( currentBlock - start)/ 3 ;
    })
  }



  getAssets() {
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          init.push(element);
        } else if (element.market === 1 && element.approved === 1) {
          second.push(element);
        }
      });
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

  checkBuyer() {
    this.assetService.getMetamaskInfo().then( data => {
      this.balance = data.balance;
      this.account = data.account;
      this.assetService.getIssuerStatus(this.account).subscribe(res => {
        console.log('this is response from check buyer', res)
        this.response = res;
      },
      error => {
        this.response = error['error'];
        console.log('this is error', error);
      })
    })
    
  }

  sendMarketOrder() {
    if (this.response === 'Buyer with blockchain address not found, please register.') {
      this.modalElement.click()
      return;
    }
    let minimumBid = parseFloat(this.auction.minimumBid);
    if (this.balance < this.amount ) {
      this.assetService.showNotification('bottom', 'center', 'You currently do not have enough balance to buy at this price, please fund your wallet and try again.', 'danger');
      return;
    } else if (this.balance < minimumBid)  {
      this.assetService.showNotification('bottom', 'center', 'You currently do not have enough balance to buy at this price, please fund your wallet and try again.', 'danger');
      return;
    } else if (this.amount < minimumBid) {
      this.assetService.showNotification('bottom', 'center', 'You cannot Bid less than the minimum acceptable bid for this asset.', 'danger');
      return;
    }
    this.assetService.showSpinner();
    if (!this.amount) {
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', 'Please confirm you have entered your bidding price for this asset.', 'danger');
      return;
    }
    this.assetService.placeBid(this.asset.tokenId, this.auctionId, this.amount).then(data => {
      setTimeout(() => {
        this.assetService.stopSpinner();
        this.ngOnInit();
        // this.router.navigateByUrl('/issuer-dashboard');
      }, 15000);
      }, err => {
        console.log('this is error', err)
        this.assetService.stopSpinner();
    })
  }

}
