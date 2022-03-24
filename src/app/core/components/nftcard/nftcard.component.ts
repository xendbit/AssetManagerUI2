import { Router } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IArtwork, IAuction } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuctionService } from '../../services/auction.service';
import { UserActionsService } from '../../services/userActions.service';
import * as moment from 'moment';

import { NgxSpinnerService } from 'ngx-spinner';
import { IEvents, IFollow, ILikes } from './event.interface';

@Component({
  selector: 'app-nftcard',
  templateUrl: './nftcard.component.html',
  styleUrls: ['./nftcard.component.scss']
})
export class NFTCardComponent implements OnInit {
  @Input() public artwork: IArtwork;
  @Input() public parentPage: string;
  countdown: string;
  countdownDay: number;
  countdownHours: number;
  countdownMinutes: number;
  countdownSeconds: number;
  distance: number;
  likes: ILikes = {
    tokenId: 0,
    likeCount: 0
  };
  followInfo: IFollow = {
    id: "",
    followCount: 0
  }
  auction: IAuction = {"auctionId": 0,"cancelled": false,"currentBlock": 0,"startBlock": 0,"endBlock": 0,"highestBid": 0,"highestBidder": "", "bids": [{bidder: "", bid: 0, auctionId: 0}],"isActive": true,
    "owner": "","sellNowPrice": 0,"title": "","currentBid": 0,"currency": "","endDate": new Date(),"startDate": new Date(),"minimumBid": 0,"tokenId": 0,
    "artwork": {"id": "","category": "","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "","collections": [],"type": ""},
      "featuredImage": {"media": "","mediaType": 0},"isBidding": true,"gallery": [{"media": "","mediaType": 0}],"description": "","price": 0,"currency": "", "assetType": "digital",
      "dateIssued": new Date(),"hasActiveAuction": true,"lastAuctionId": 0,"likes": 0,"sold": false,"name": "","tokenId": 0,"symbol": "","type": ""},"type": ""}
  today: number;
  notExpired: boolean;
  auctionTime: number;
  currentTime: number;
  sellPriceMet: boolean = false;
  isLoaded: boolean = false;
  hideNft: boolean = false;
  hasActiveAuction: boolean = true;

  constructor(public mainService: MainService, public auctionService: AuctionService,
    public userActions: UserActionsService,  private spinner: NgxSpinnerService, public router: Router,
    private clipboard: Clipboard) { }

  ngOnInit() {
    this.spinner.show('spinner1');
  }

  ngOnChanges() {
    // this.spinner.show();
    if (this.artwork !== null) {
      this.today = new Date().getTime();
      this.getLikes(this.artwork.tokenId);
      this.isLoaded = false;
      this.auctionService.fetchAuctionFromMain(this.artwork.tokenId, this.artwork.lastAuctionId).subscribe((data: any) => {
        if (data === 'Auction has ended') {
          this.hasActiveAuction = false;
        } else {
          this.auction = data;
          this.setCountDown(this.auction.endDate);
          if (this.auction['bids']?.length > 0) {
            this.auction['bids']?.sort((a, b) => (a.bid > b.bid ? -1 : 1)); // sort array of bids from highest downwards
            if (this.auction.bids[0]['bid'] >= this.auction.sellNowPrice) {
              this.sellPriceMet = true;
            } else {
              this.sellPriceMet = false;
            }
          }
        }

      })
    }
  }

  like(tokenId) {
    this.userActions.BroadcastLikes("like", 1, tokenId);
    this.getLikes(tokenId);
  }

  getLikes(tokenId) {
    this.likes.likeCount = this.userActions.getLikes(tokenId);
  }


  follow(username) {
    this.userActions.BroadcastFollowEvent("follow", 1, username);
    this.getFollowerCount(username);
  }

  getFollowerCount(username) {
    this.followInfo.followCount = this.userActions.getFollowCount(username);
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.userActions.addSingle('global' ,'success', 'Copied', 'Copied to clipboard!');
  }



  setCountDown(date) {
    this.auctionTime =  moment(new Date(date)).unix();
    this.currentTime = moment(new Date()).unix();
    const diffTime = this.auctionTime - this.currentTime;
    let duration;
    duration = moment.duration(diffTime, 'seconds');
    const interval = 1000;

    setInterval(() => {
      this.countdownDay = duration.days();
      this.countdownHours = duration.hours();
      this.countdownMinutes = duration.minutes();
      this.countdownSeconds = duration.seconds();
    }, interval);

  }

  placeBid() {
    localStorage.setItem('auctionData', JSON.stringify(this.auction));
    localStorage.setItem('artworkData', JSON.stringify(this.artwork));
    this.router.navigate(['/details/', this.artwork.tokenId, this.artwork.lastAuctionId]);
  }

  goToCreatorPage() {
    this.router.navigateByUrl('/');
  }

  goToOwnerPage() {
    this.router.navigateByUrl('/');
  }

}
