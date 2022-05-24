import { Router } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IArtwork, IAuction, IminiAuctionInfo } from '../slider/presentation.interface';
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
  auction: IminiAuctionInfo = {
    "auctionId": "", "cancelled": false, "chain": "", "currentBlock": "", "endBlock": "", "endDate": "", "finished": false, "highestBid": "",
    "highestBidder": "", "id": 0, "minimumBid": "", "owner": "", "sellNowPrice": "", "sellNowTriggered": false,
    "startBlock": "", "startDate": "", "started": true, "tokenId": ""}
  today: number;
  notExpired: boolean;
  auctionTime: any;
  currentTime: any;
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
      this.auction = this.artwork.auctions;
      if (this.artwork.auctions !== null) {
        if (this.auction.cancelled === true || this.auction.finished === true || this.auction.sellNowTriggered === true) {
          this.hasActiveAuction = false;
        } else {
          this.setCountDown(this.auction.endDate);
        }
      }
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
    this.auctionTime =  Math.floor(new Date(date).getTime());
    this.currentTime = Math.floor(new Date().getTime());
    let diff = Math.floor((this.auctionTime - this.currentTime) / 1000);
    // console.log('this =>',this.currentTime < this.auctionTime)
    const interval = 1000;
    setInterval(() => {
      this.countdownDay = this.mainService.getDays(diff);
      this.countdownHours = this.mainService.getHours(diff);
      this.countdownMinutes = this.mainService.getMinutes(diff);
      this.countdownSeconds = this.mainService.getSeconds(diff);
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
