import { Router } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IArtwork, IAuction, IminiAuctionInfo } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuctionService } from '../../services/auction.service';
import { UserActionsService } from '../../services/userActions.service';
import {DomSanitizer} from '@angular/platform-browser';

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
  liked: boolean = false;
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
  likes: number = 0;

  constructor(public mainService: MainService, public auctionService: AuctionService,
    public userActions: UserActionsService,  private spinner: NgxSpinnerService, public router: Router,
    private sanitizer:DomSanitizer,
    private clipboard: Clipboard) { }

  ngOnInit() {
    this.spinner.show('spinner1');
  }

  ngOnChanges() {
    // this.spinner.show();
    if (this.artwork !== null) {
      this.today = new Date().getTime();
      let account = localStorage.getItem('account');
      let likesArray: any[] = [];
      console.log('this =======>', this.artwork.gallery[1].media)
      if (this.artwork.likes) {
        likesArray = this.artwork.likes || [];
        this.likes = this.artwork.likes.length;
        if (likesArray.length > 0 && account !== null) {
          this.liked = likesArray.some((res: any) => res.userAddress.toLowerCase() === account.toLowerCase())
        }
      }
      this.isLoaded = false;
      this.auction = this.artwork.auctions;
      if (this.artwork.auctions !== undefined && this.artwork.auctions !== null) {
        if (this.auction.cancelled === true || this.auction.finished === true || this.auction.sellNowTriggered === true) {
          this.hasActiveAuction = false;
        } else {
          this.setCountDown(this.auction.endDate);
        }
      }
    }
  }

  sanitize(url:string){
    // return this.sanitizer.bypassSecurityTrustUrl(url);
    const mu =  url.replace("unsafe: ","");
    console.log("Value of MU",mu)
    return mu;
  }

  like(tokenId) {
    let account = localStorage.getItem('account');
    if (localStorage.getItem('account')) {
      this.userActions.BroadcastLikes("like", 1, tokenId, account).subscribe((data: any) => {
        if (data.status === 'success' && this.liked === false) {
          this.liked = true;
          this.likes + 1;
        }
      }, err => {
        this.userActions.errorToast('We are sorry, there has been an error while trying to like this token, try again later.')
      })
    } else {
      this.userActions.errorToast('You need to login or connect wallet to like this token.')
    }
  }

  // getLikes(tokenId) {
  //   this.likes.likeCount = this.userActions.getLikes(tokenId);
  // }


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
