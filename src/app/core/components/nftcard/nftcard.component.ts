import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IArtwork, IAuction } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { interval } from 'rxjs/internal/observable/interval';
import { map, takeWhile } from 'rxjs/operators';
import { AuctionService } from '../../services/auction.service';
import { UserActionsService } from '../../services/userActions.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { IEvents, IFollow, ILikes } from './event.interface';

@Component({
  selector: 'app-nftcard',
  templateUrl: './nftcard.component.html',
  styleUrls: ['./nftcard.component.scss']
})
export class NFTCardComponent implements OnInit {
  @Input() public artwork: IArtwork;
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
  auction: IAuction = {"auctionId": "","cancelled": false,"currentBlock": 0,"startBlock": 0,"endBlock": 0,"highestBid": 0,"highestBidder": "","isActive": true,
    "owner": "","sellNowPrice": 0,"title": "","currentBid": 0,"currency": "","endDate": new Date(),"startDate": new Date(),"minimumBid": 0,"tokenId": 0,
    "artwork": {"id": "","category": "","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "","collections": [],"type": ""},
      "featuredImage": {"media": "","mediaType": 0},"isBidding": true,"gallery": [{"media": "","mediaType": 0}],"description": "","price": 0,"currency": "",
      "dateIssued": "","lastAuctionId": 0,"likes": 0,"sold": false,"name": "","tokenId": 0,"symbol": "","type": ""},"type": ""}

  constructor(public mainService: MainService, public auctionService: AuctionService, 
    public userActions: UserActionsService,  private spinner: NgxSpinnerService) { }

  ngOnInit() {  


  }

  ngOnChanges() {
    this.spinner.show();
    if (this.artwork !== null) {
      this.getLikes(this.artwork.tokenId);
      this.auctionService.fetchAuctionFromMain(this.artwork.tokenId, this.artwork.lastAuctionId).subscribe((data: IAuction) => {
        this.auction = data;
        this.setCountDown(this.auction.endDate)
        this.spinner.hide();
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

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    console.log('copied this =>', val)
  }

  setCountDown(date) {
   var end = new Date('2021-11-11T14:01:08.000Z').getTime();
   var _second = 1000;
   var _minute = _second * 60;
   var _hour = _minute * 60;
   var _day = _hour * 24;

   setInterval(() => {
      var now = new Date().getTime();
       this.distance = end - now;
       var days = Math.floor(this.distance / _day);
       var hours =  Math.floor((this.distance % _day) / _hour );
       var minutes = Math.floor((this.distance % _hour) / _minute);
       var seconds = Math.floor((this.distance % _minute) / _second);

       this.countdownDay = days;
       this.countdownHours = hours;
       this.countdownMinutes = minutes;
       this.countdownSeconds = seconds;
      }, 1000)
  }

  // onClick(event: MouseEvent) {
  //   this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, event));
  //   this.listenToEvent()
  // }

  // listenToEvent() {
  //   this.eventQueue.on(AppEventType.ClickedOnNotification).subscribe(event => this.handleEvent(event.payload));
  // }

  
  

}
