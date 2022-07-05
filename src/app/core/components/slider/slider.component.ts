import { Router } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MainService } from '../../services/main.service';
import { UserActionsService } from '../../services/userActions.service';
import { IFollow, ILikes } from '../nftcard/event.interface';
import { IPresentation } from './presentation.interface';
import { creatorPage, ownerPage, placeBidPage } from '../../config/app-config.const';
import { Clipboard } from '@angular/cdk/clipboard';
import * as moment from 'moment';
import { AuctionService } from '../../services/auction.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() public slider: IPresentation;
  presentationData: IPresentation =
    {
      "slides":  [
        {
            "auctionId": 0,
            "cancelled": false,
            "currentBlock": 0,
            "startBlock": 0,
            "endBlock": 0,
            "highestBid": 0,
            "highestBidder": "",
            "isActive": true,
            "owner": "",
            "sellNowPrice": 0,
            "title": "The Mystic",
            "subtitle": "The mystical artworks of the kubembe",
            "bids": [{"bidder": "", "bid": 0, "auctionId": 0}],
            "currentBid": 0,
            "currency": "",
            "endDate": new Date(),
            "startDate": new Date(),
            "minimumBid": 0,
            "tokenId": 0,
            "artwork": {
                "id": "",
                "category": "",
                "tags": [],
                "auctions": { "auctionId": "",
                "cancelled": false, "chain": "", "currentBlock": "", "endBlock": "", "endDate": "", "finished": false, "highestBid": "",
                "highestBidder": "", "id": 0, "minimumBid": "", "owner": "", "sellNowPrice": "", "sellNowTriggered": false,
                "startBlock": "", "startDate": "", "started": true, "tokenId": ""},
                "owner": {
                    "id": "",
                    "image": "",
                    "username": ""
                },
                "creator": {
                    "id": "",
                    "image": "",
                    "username": "",
                    "collections": [],
                    "type": ""
                },
                "featuredImage": {
                    "media": "/assets/img/slide1.jpeg",
                    "mediaType": 0
                },
                "isBidding": true,
                "gallery": [],
                "description": "Description",
                "price": 0,
                "currency": "ETH",
                "likes": [],
                "type": "Artwork",
                "lastAuctionId": 0,
                "hasActiveAuction": true,
                "symbol": "",
                "tokenId": 0,
                "name": "",
                "dateIssued": new Date(),
                "assetType": "digital",
                "sold": false
            },
            "type": "Auction"
        },
      ],
    "presentationType": 0
    };
  countdownSeconds: number;
  distance: number;
  countdownDay: number;
  countdownHours: number;
  countdownMinutes: number;
  likes: ILikes = {
    tokenId: 0,
    likeCount: 0
  };
  followInfo: IFollow = {
    id: "",
    followCount: 0
  }
  auctionTime: number;
  currentTime: number;
  currentBid: any;
  auctionValue: number;
  responsiveOptions:any[] = [
      {
          breakpoint: '1024px',
          numVisible: 1
      },
      {
          breakpoint: '768px',
          numVisible: 1
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];

  constructor(public mainService: MainService, public userActions: UserActionsService, public router: Router,
    private clipboard: Clipboard, public auctionService: AuctionService) {

  }

   ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['slider'] && this.slider !== undefined ){
      this.presentationData = this.slider;
      let endDate =   this.presentationData.slides.filter(slide => {
        if (slide['type'] === 'Auction') {
          this.currentBid = slide['highestBid'];
          return slide['endDate'];
        }
      })
      this.auctionService.getUSDValue().subscribe(res => {
        this.auctionValue = res['USD'] * this.currentBid;
      })
      this.setCountDown(endDate);
    }
  }

  like(tokenId) {
    let account = localStorage.getItem('account');
    if (localStorage.getItem('account')) { 
      this.userActions.BroadcastLikes("like", 1, tokenId, account).subscribe((data: any) => {
        if (data.status === 'success') {
          this.getLikes(tokenId);
        }
      }, err => {
        this.userActions.errorToast('We are sorry, there has been an error while trying to like this token, try again later.')
      })
    } else {
      this.userActions.errorToast('You need to login or connect wallet to like this token.')
    }
  }

  getLikes(tokenId) {
    this.likes.likeCount = this.userActions.getLikes(tokenId);
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.userActions.addSingle('global','success', 'Copied', 'Copied to clipboard!');
  }

  follow(username) {
    if (localStorage.getItem('account')) {
      let account = localStorage.getItem('account');
      this.userActions.BroadcastFollowEvent("follow", 1, username, account).subscribe((res: any) => {
        if (res.status === 'success') {
          this.userActions.successToast('Successfully followed this account');
          this.getFollowerCount(username);
        } else {
          this.userActions.errorToast('We are sorry, there has been an error while trying to follow this account, try again later.')
        }
      }, err => {
        this.userActions.errorToast('We are sorry, there has been an error while trying to follow this account, try again later.')
      })
    } else {
      this.userActions.errorToast('You need to login or connect wallet to follow this account.')
    }
  }

  getFollowerCount(username) {
    this.followInfo.followCount = this.userActions.getFollowCount(username);
  }

  placeBid() {
    this.router.navigateByUrl(placeBidPage.path); // no url for place bid page as page hasn't been created yet.
  }

  goToCreatorPage() {
    this.router.navigateByUrl(creatorPage.path);
  }

  goToOwnerPage() {
    this.router.navigateByUrl(ownerPage.path);
  }

  setCountDown(date) {
    this.auctionTime =  moment(new Date('2021-11-11T14:01:08.000Z').getTime()).unix();
    this.currentTime = moment(new Date().getTime()).unix();
    const diffTime = this.auctionTime - this.currentTime;
    let duration;
    duration = moment.duration(diffTime * 1000, 'milliseconds');
    const interval = 1000;

    setInterval(() => {
      duration = moment.duration(duration - interval, 'milliseconds');
      this.countdownDay = moment.duration(duration).days();
      this.countdownHours = moment.duration(duration).hours();
      this.countdownMinutes = moment.duration(duration).minutes();
      this.countdownSeconds = moment.duration(duration).seconds();
    }, interval);

  }


}
