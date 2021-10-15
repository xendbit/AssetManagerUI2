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
  @Input() public slider: IPresentation [];
  public presentationData: IPresentation;
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
  constructor(public mainService: MainService, public userActions: UserActionsService, public router: Router,
    private clipboard: Clipboard, public auctionService: AuctionService) { 
 
   
  }

   ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
   
    if (changes['slider'] && this.slider !== undefined){
      this.slider = this.slider;
      let endDate =   this.slider.filter(slide => {
        if (slide['type'] === 'Auction') {
          this.currentBid = slide['highestBid'];
          return slide['endDate'];
        }
      })
      this.auctionService.getETHtoUSDValue().subscribe(res => {
        this.auctionValue = res['last_trade_price'] * this.currentBid;
      })
      this.setCountDown(endDate);
    }
  }

  like(tokenId) {
    this.userActions.BroadcastLikes("like", 1, tokenId);
    this.getLikes(tokenId);
  }

  getLikes(tokenId) {
    this.likes.likeCount = this.userActions.getLikes(tokenId);
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.userActions.addSingle('success', 'Copied', 'Copied to clipboard!');
  }

  follow(username) {
    this.userActions.BroadcastFollowEvent("follow", 1, username);
    this.getFollowerCount(username);
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
