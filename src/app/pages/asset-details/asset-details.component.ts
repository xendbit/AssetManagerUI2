import { countryList } from './countries';
import { UserActionsService } from './../../core/services/userActions.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuction, IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { trigger, transition, animate, style } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { AuctionService } from 'src/app/core/services/auction.service';
import { MainService } from 'src/app/core/services/main.service';
import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { networkChains } from 'src/environments/environment';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/core/services/payment.service';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class AssetDetailsComponent implements OnInit {
  distance: number; countdownDay: number; countdownHours: number;
  countdownMinutes: number; countdownSeconds: number; visible: boolean = true;
  account: string; balance: number = 0; amount: number; owner: boolean = false;
  auctionId: number; currentBlock: any; startDate: any; endDate: any; sellNowPrice: number; minimumPrice: number;
  auctionTime: any; currentTime: any; auctionValue: number; response: any; error: any; displayOverlay: boolean = false;
  email: string; firstName: string; lastName: string; middleName: string; phone: number;
  country: string; zipCode: string; state: string; city: string; street: string; houseNumber: string;
  sellNowValue: number;
  sellNowValueNGN: number;
  sellPriceMet: boolean = false;
  today: Date;
  accountFound: boolean;
  lastBidder: boolean;
  contractAddress: any;
  hasActiveAuction: boolean = false;
  tokenFound: boolean = true;
  metBuyNow: boolean;
  auctionLength: number = 0;
  foundNetwork: {};
  checked: boolean = true;
  countriesArray: any[] = countryList;
  billingAddress: string;
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  paying = false;
  display: boolean = false;
  displayRegister: boolean = false;
  fullname: string = "";
  paymentEmail: string;
  paymentAmount: number;
  payId: string = '';
  displayPosition: boolean;
  selectedCountry: any;
  tokenId: any;
  usdValue: any;
  userWallet: any;
  maxDate: any;

  constructor(private router: Router,
    public activatedRoute: ActivatedRoute,
    public metamaskService: MetamaskService,
    public mainService: MainService,
    public userActions: UserActionsService,
    private ngxService: NgxUiLoaderService,
    private auctionService: AuctionService,
    public toast: HotToastService,
    public paymentService: PaymentService) {
      this.metamaskService.getContractAddress().subscribe(response => {
        this.contractAddress = response['data'];
      });
     }

  ownerArtworks: IArtwork[];
  auction: IAuction = {"auctionId": 0,"cancelled": false,"currentBlock": 0,"startBlock": 0,"endBlock": 0,"highestBid": 0,"highestBidder": "", "bids": [{bidder: "none", bid: 0, auctionId: 0}],"isActive": true,
    "owner": "","sellNowPrice": 0,"title": "","currentBid": 0,"currency": "","endDate": new Date(),"startDate": new Date(),"minimumBid": 0,"tokenId": 0,
    "artwork": {"id": "","category": "","tags": [],        "auctions": { "auctionId": "",
    "cancelled": false, "chain": "", "currentBlock": "", "endBlock": "", "endDate": "", "finished": false, "highestBid": "",
    "highestBidder": "", "id": 0, "minimumBid": "", "owner": "", "sellNowPrice": "", "sellNowTriggered": false,
    "startBlock": "", "startDate": "", "started": true, "tokenId": ""},
    "owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "","collections": [],"type": ""},
      "featuredImage": {"media": "","mediaType": 0},"isBidding": true,"gallery": [{"media": "","mediaType": 0}],"description": "","price": 0,"currency": "",
      "dateIssued": new Date(),"hasActiveAuction": true, "lastAuctionId": 0,"likes": [],"sold": false,"name": "","tokenId": 0,"symbol": "", "assetType": "digital", "type": ""},"type": ""};
  artwork: IArtwork = {"id": "","category": "","tags": [],        "auctions": { "auctionId": "",
  "cancelled": false, "chain": "", "currentBlock": "", "endBlock": "", "endDate": "", "finished": false, "highestBid": "",
  "highestBidder": "", "id": 0, "minimumBid": "", "owner": "", "sellNowPrice": "", "sellNowTriggered": false,
  "startBlock": "", "startDate": "", "started": true, "tokenId": ""},
      "owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "",
      "collections": [],"type": ""},"featuredImage": {"media": "","mediaType": 0},"isBidding": true, "gallery": [{ "media": "",
      "mediaType": 0 }], "description": "", "price": 0, "currency": "", "dateIssued": 0, "hasActiveAuction": true, "lastAuctionId": 0, "likes": [], "assetType": "digital", "sold": false, "name": "", "tokenId": 0, "symbol": "", "type": ""};

  async ngOnInit(): Promise<void> {
    this.ngxService.start();

    let networkChain = parseInt(localStorage.getItem('networkChain'));
    if (networkChain === undefined || networkChain === null) {
      networkChain === 97 //defaults to bsc
    }
    this.checkConnection();
    this.tokenId = this.activatedRoute.snapshot.params['asset'];
    this.artwork = JSON.parse(localStorage.getItem('artworkData'));
    this.getSingleArtworkDetails();
    this.getCreatorArt();
    if (this.artwork.auctions !== undefined) {
      this.auction = JSON.parse(localStorage.getItem('auctionData'));
      this.initialCheck();
    }
    this.foundNetwork = (networkChains.find((res: any) => res.systemName === this.artwork.chain)|| 'BNB')
    this.metamaskService.getContractAddress().subscribe(data => {
      if (data['status'] === 'success') {
        this.contractAddress = data['data'];
        localStorage.removeItem('contractAddress');
        localStorage.setItem('contractAddress', this.contractAddress)
      }
    })
    window.onbeforeunload = function() {window.scrollTo(0,0);};
    this.today = new Date();
    var future = new Date();
    this.maxDate = new Date(future.setDate(future.getDate() + 30));
  }

  initialCheck() {
    if (this.artwork.lastAuctionId !== 0) {
      this.hasActiveAuction = true;
      if (!this.auction.bids || this.auction.bids?.length < 1) {
        this.auctionLength = 0
      } else if (this.auction.bids) {
        this.auctionLength = this.auction.bids.length;
      }

      if (this.auctionLength > 0) {
        this.auction['bids']?.sort((a, b) => (a.bid > b.bid ? -1 : 1));
      }
      this.auctionService.getUSDValue().subscribe(res => {
        this.usdValue = res['USD'];
        if (this.auctionLength > 0) {
          this.auctionValue = res['USD'] * this.auction.bids[0]['bid'];
          this.sellNowValue = res['USD'] * this.auction.sellNowPrice;
          this.sellNowValueNGN = res['NGN'] * this.auction.sellNowPrice;
          if (this.auction.bids[0].bid !== 0) {
            if (this.account !== undefined) {
              if (this.auction.bids[0]['bidder'].toLowerCase() === this.account.toLowerCase() ) {
                this.lastBidder = true;
              }
            }
            if (this.auction.bids[0]['bid'] < this.auction.sellNowPrice) {
              this.sellPriceMet = false;
            } else {
              this.sellPriceMet = true;
            }
          }
        } else {
          this.sellNowValue = res['USD'] * this.auction.sellNowPrice;
          this.auctionValue = res['USD'] * this.auction.minimumBid;
          this.sellPriceMet = false;
        }
      })
    }
  }

  getCreatorArt() {
    this.mainService.getOwnerAssets().subscribe((res: IArtwork []) => {
      if (res !== null) {
        this.ownerArtworks = res.filter((data: any) => data.hasActiveAuction && data.isApproved);
        // this.categories = this.artworks.map(item => item.category)
        // .filter((value, index, self) => self.indexOf(value) === index);
        // this.ngxService.stop();
      } else {
        // this.ngxService.stop();
      }
    }, err => {
      this.ngxService.stop();
    })
  }

  getSingleArtworkDetails() {
    this.mainService.fetchSingleArtwork(this.tokenId).subscribe((res: any) => {
      if (res && res.statusCode === 404) {
        this.tokenFound = false;
        this.ngxService.stop();
      } else {
        this.artwork = res;
        this.sellPriceMet = false;
        if (this.artwork.lastAuctionId !== 0) {
          this.auctionService.fetchAuctionFromMain(this.tokenId, res.lastAuctionId).subscribe((res: any) => {
            if (res === 'Auction has ended') {
              this.hasActiveAuction = false;
              this.ngxService.stop();
            } else {
              this.hasActiveAuction = true;
              this.auction = res;
              this.auctionLength = this.auction.bids.length;
              this.auction['bids']?.sort((a, b) => (a.bid > b.bid ? -1 : 1));
              this.checkBuyer();
              this.auctionService.getUSDValue().subscribe(res => {
                if (this.auction.bids.length > 0) {
                  this.auctionValue = res['USD'] * this.auction.bids[0]['bid'];
                  this.sellNowValue = res['USD'] * this.auction.sellNowPrice;
                  this.sellNowValueNGN = res['NGN'] * this.auction.sellNowPrice;
                  if (this.account !== undefined) {
                    if (this.auction.bids[0]['bidder'].toLowerCase() === this.account.toLowerCase() ) {
                      this.lastBidder = true;
                    }
                  }
                  if (this.auction.bids[0]['bid'] < this.auction.sellNowPrice) {
                    this.sellPriceMet = false;
                  } else {
                    this.sellPriceMet = true;
                  }
                } else {
                  this.sellNowValue = res['USD'] * this.auction.sellNowPrice;
                  this.auctionValue = res['USD'] * this.auction.highestBid;
                  this.sellPriceMet = false;
                }
              }, err => {
                this.ngxService.stop();
              })
              this.setCountDown(this.auction.endDate);
            }
          }, err => {
            console.log('this is error')
          })
        } else {
          this.ngxService.stop();
        }
      }
    }, err => {
      this.ngxService.stop();
      console.log('err', err)
    })
  }

  checkConnection() {
    this.userWallet = localStorage.getItem('userWallet');
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        this.metamaskService.checkConnection().then(res => {
          if (res === undefined || !localStorage.getItem('account')) {
            this.accountFound = false;
            this.error = 'Please Connect to your Metamask wallet account.'
            return;
          } else {
            this.accountFound = true;
            this.account = localStorage.getItem('account');
            this.metamaskService.getBalance().subscribe(response => {
              this.balance = response['data'];
            })
            if (this.account.toLowerCase() === this.artwork.owner.username.toLowerCase()){
              this.owner = true;
            }
            if (this.artwork.lastAuctionId === 0 && this.owner === true) {
              this.visible = true;
            }
          }
        })
      }
      if (this.userWallet === 'WalletConnect' && localStorage.getItem('account')) {
        this.accountFound = true;
        this.account = localStorage.getItem('account');
        this.metamaskService.getBalance().subscribe(response => {
          this.balance = response['data'];
        })
        if (this.account.toLowerCase() === this.artwork.owner.username.toLowerCase()){
          this.owner = true;
          if (this.artwork.lastAuctionId === 0 && this.owner === true) {
            this.visible = true;
          }
        }
      }
    }
  }

  setCountDown(date) {
    this.auctionTime =  Math.floor(new Date(date).getTime());
    this.currentTime = Math.floor(new Date().getTime());
    let diff = Math.floor((this.auctionTime - this.currentTime) / 1000);
    const interval = 1000;
    this.countdownDay = this.mainService.getDays(diff);
    this.countdownHours = this.mainService.getHours(diff);
    this.countdownMinutes = this.mainService.getMinutes(diff);
    this.countdownSeconds = this.mainService.getSeconds(diff);
    this.ngxService.stop();
  }

  goToCheckout() {
    // const amount = this.usdValue * this.amount;
    if (this.visible && !this.accountFound) {
      this.toast.warning('You need to login or sign-up before checkout.');
      this.display = true;
    } else {
      this.router.navigate(['/checkout/' + this.tokenId + '/' + this.sellNowValue])
    }
  }

  openForm() {
    this.visible = true;
  }

  bid() {
    if(this.response === undefined) {
      this.toast.error('Please confirm that your wallet is connected.');
      return;
    }
    if (this.response === 404 && this.artwork.assetType === "physical") {
      this.displayOverlay = true;
      return;
    }
    let currentBid = this.auction.highestBid;
    if (+this.balance < +this.amount ) {
      this.toast.error('You currently do not have enough balance to buy at this price, please fund your wallet and try again.');
      return;
    } else if (+this.balance < +currentBid)  {
      this.toast.error('You currently do not have enough balance to buy at this price, please fund your wallet and try again.');
      return;
    } else if (+this.amount <= +currentBid) {
      this.toast.error('The bid amount has to be higher than the current bid for this asset.');
      return;
    }

    if (!+this.amount) {
      this.toast.error('Please confirm you have entered your bidding price for this asset.');
      return;
    }
    this.checkConnection();
    this.ngxService.start();
    if (+this.amount >= this.auction.sellNowPrice) {
      this.metBuyNow = true;
      this.sellPriceMet = true;
      this.owner = true;
      this.hasActiveAuction = false;
    }
    this.metamaskService.placeBid(this.artwork.tokenId, this.auction.auctionId, this.amount).then(data => {
      if (data['code'] === 4001) {
        this.metBuyNow = false;
        this.sellPriceMet = false;
        this.owner = false;
        this.hasActiveAuction = true;
        this.ngxService.stop();
        this.toast.error('Bid cancelled');
        return;
      } else {
        this.auctionService.fetchAuctionFromMain(this.artwork.tokenId, this.artwork.lastAuctionId).subscribe((res: any) => {
          if (!this.metBuyNow) {
            this.auction = res;
            this.toast.success('Bid placed successfully');
            // window.location.reload();
            this.ngOnInit();
          }
          if (this.metBuyNow) {
            this.hasActiveAuction = false;
            this.toast.success('You are the winning bidder for this auction.');
            this.auctionService.changeTokenOwnership(this.artwork.tokenId).subscribe(tokenOwnerResponse => {
              console.log(this.account.toLowerCase() === this.artwork.owner.username.toLowerCase())
              if (this.owner === true){
                if (this.artwork.lastAuctionId === 0 && this.owner === true) {
                  this.visible = true;
                }
                this.ngxService.stop();
                this.router.navigate(['/profile']).then(() => {
                  this.toast.success(this.artwork.symbol + ' Has been added to the list of artworks under your profile.');
                  window.location.reload();
                });
              }
              this.ngxService.stop();
              // this.ngOnInit();
            }, err => {
              this.ngxService.stop();
              this.toast.success('There has been an error, please try again.');
              return;
            })
          }
        }, err => {
          this.ngxService.stop();
          this.toast.success('There has been an error, please try again.');
        });
      }

    }, err => {
        this.ngxService.stop();
    })

  }

  async startAuction(auction: NgForm, tokenId) {
    let minBid;
    let sell;
    if (this.artwork.assetType === 'physical') {
      minBid = auction.value.sellNowPrice;
      sell =  auction.value.sellNowPrice;
    } else {
      minBid = auction.value.minimumPrice;
      sell =  auction.value.sellNowPrice;
    }

    if (+minBid === 0) {
      this.toast.error('Please enter a minimum bid price greater than 0')
      return;
    }
    if (+sell <  +minBid) {
      this.toast.error('Please enter a sell-now price greater than or equal to your minimum bid')
      return;
    }
    this.checkConnection();
    this.ngxService.start();
    this.metamaskService.getCurrentBlock().subscribe(async res => {
      this.currentBlock = res['data'];
      let startDate = new Date(auction.value.startDate);
      let endDate = new Date(auction.value.endDate);
      let currentDate = Date.now();

      let initialStart: number = Math.abs(Math.floor((currentDate - startDate.getTime()) / 1000 / 60 / 60 / 24));
      let initialEnd: number = Math.abs(Math.floor((currentDate - endDate.getTime()) / 1000 / 60 / 60 / 24));
      let startBlock: number = this.currentBlock + ((initialStart * 24 * 60 * 60)/3);
      let endBlock: number = this.currentBlock + ((initialEnd * 24 * 60 * 60)/3) ;
      let sellNow: string =  sell.toString();
      let minimumPrice: string =  minBid.toString();
      var rndNo: number = Math.round((Math.random() * 1000000)) + 1;
      this.auctionId = rndNo;

      if (this.artwork.assetType === 'physical') {
        await this.metamaskService.sellNow(this.artwork.tokenId, sellNow).then((res: any) => {
          console.log('physical', res)
        }, err => {
          console.log('err', err)
          this.ngxService.stop()
        })
      }
      if (this.artwork.assetType === 'digital') {
        await this.metamaskService.startAuction(this.artwork.tokenId, this.auctionId, startBlock, endBlock, this.currentBlock, sellNow, minimumPrice).then( res => {
          setTimeout(() => {
            this.auctionService.startAuctionNifty(this.auctionId, this.artwork.tokenId, startDate, endDate).subscribe((data: any) => {
              if (data.status === "success") {
                this.toast.success( 'Auction has been started for this asset')
                this.visible = false;
                this.ngxService.stop();
                this.router.navigate(['/profile']).then(() => {
                  window.location.reload();
                }, err => {
                  this.ngxService.stop();
                });
              } else {
                  this.ngxService.stop();
                  this.toast.error('There has been an error while trying to start this auction, please try again.')
              }

            }, err =>  {
            this.ngxService.stop();
            })
          }, 15000)
        }, err => {
          this.ngxService.stop();
        })
      }
    }, err => {
      this.ngxService.stop()
    })
  }

  withdraw() {
    this.ngxService.start();
    this.metamaskService.withdraw(this.artwork.tokenId, this.auctionId).then( res => {
      // console.log('this is res', res)
      this.ngxService.stop();
    }, err => {
      this.ngxService.stop();
    })
  }

  checkBuyer() {
    if (!localStorage.getItem('account')) {
      this.accountFound = false;
      this.error = 'Please connect your metamask wallet account to bid on this asset.'
      return;
    } else {
      this.mainService.getBuyerStatus(this.account).subscribe(res => {
        this.response = res;
      },
      error => {
        this.response = error['error'];
        this.response = error['error']['data']['statusCode'];
      })
    }
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
      let blockchainAddress = this.account;
      if (this.accountFound !== true) {
        blockchainAddress = this.metamaskService.createWalletForBuyer().buyerAddress;
      }
      if (email === undefined || phone === undefined  || firstName === undefined || middleName === undefined ||
        lastName === undefined || country === undefined ||
        zipCode === undefined || state === undefined || city === undefined || street === undefined || houseNumber === undefined) {
          this.toast.error('Please make sure all fields are completed and correct.')
          this.ngxService.stop();
        this.displayOverlay = true;
      }
      this.ngxService.start();
      this.mainService.saveBuyer(email, phone, firstName, lastName, middleName, blockchainAddress,
        country, zipCode, state, city, street, houseNumber).subscribe(res => {
        if (res['status'] === 'success') {
          this.ngxService.stop();
          this.toast.success('Buyer has been registered successfully!');
          this.displayOverlay = false;
          this.checkBuyer();
          this.ngOnInit();
        }
      }, err => {
        this.error = err.error.data.error;
        this.ngxService.stop();
        this.toast.error(this.error);
        this.displayOverlay = false;
        this.checkBuyer();
      })
    }

    continuePayment() {
      this.selectedCountry = this.selectedCountry.name;
      if (this.billingAddress === undefined || this.billingAddress === '') {
        this.userActions.addSingle('global', 'error', 'Error', 'Please make sure all fields are completed and correct.');
        return;
      }
      if (this.paymentEmail === '') {
        this.userActions.addSingle('global', 'error', 'Error', 'Please make sure all fields are completed and correct.');
        return;
      }
      if (this.selectedCountry === 'Nigeria') {
        this.payWithRave();
        this.displayPosition = false
      }else {
        this.paymentService.createPaymentIntent(this.sellNowValue * 100, this.paymentEmail)
        .subscribe(pi => {
          this.elementsOptions.clientSecret = pi.client_secret;
          this.payId = pi.id;
          this.paying = true;
        }, err => {
          console.log('err', err)
        });
      }
    }

    listenToRegister(e: any) {
      console.log('reg', e)
      if (e === true) {
        this.displayRegister = true;
        this.display = false;
      } else {
        this.displayRegister = false
        this.display = false;
      }
  }

    listenToLogin(e: any) {
      console.log('log', e)
      if (e === true) {
        this.display = true;
        this.displayRegister = false
      } else {
        this.display = false
        this.displayRegister = false
      }
    }


   getCountry(country: any) {
     this.selectedCountry = country;
   }

   payWithRave() {
    this.paymentService.payWithRave(this.paymentEmail, this.sellNowValueNGN,
    '090332323323', 'djskd767'
    ).subscribe((res: any) => {
      console.log('res', res)
    }, err => {
      console.log(' err', err)
    })
  }

  getChain() {
    return localStorage.getItem('currentChain');
  }
}
