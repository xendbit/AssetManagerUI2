import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { MainService } from '../../services/main.service';
import { UserActionsService } from '../../services/userActions.service';
import { IFollow, ILikes } from '../nftcard/event.interface';
import { IPresentation } from './presentation.interface';

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
  constructor(public mainService: MainService, public userActions: UserActionsService, public router: Router) { 
 
   
  }

   ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
   
    if (changes['slider'] && this.slider !== undefined){
      console.log('this is slider', this.slider)
      this.slider = this.slider;
      let endDate =   this.slider.filter(slide => {
        if (slide['type'] === 'Auction') {
          return slide['endDate'];
        }
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

  follow(username) {
    this.userActions.BroadcastFollowEvent("follow", 1, username);
    this.getFollowerCount(username);
  }

  getFollowerCount(username) {
    this.followInfo.followCount = this.userActions.getFollowCount(username);
  }

  placeBid() {
    this.router.navigateByUrl('/'); // no url for place bid page as page hasn't been created yet.
  }

  goToCreatorPage() {
    this.router.navigateByUrl('/');
  }

  goToOwnerPage() {
    this.router.navigateByUrl('/');
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
  

}
