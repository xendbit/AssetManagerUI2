import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IArtwork, IAuction } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { interval } from 'rxjs/internal/observable/interval';
import { map, takeWhile } from 'rxjs/operators';
import { AuctionService } from '../../services/auction.service';
import { EventQueueService } from '../../services/event-queue.service';
import { AppEvent, AppEventType } from './nftEnum.type';

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
  auction: IAuction;

  constructor(public mainService: MainService, public auctionService: AuctionService, public eventQueue: EventQueueService) { }

  ngOnInit() {  
    this.auctionService.fetchAuctionFromMain(this.artwork.tokenId, this.artwork.lastAuctionId).subscribe((data: IAuction) => {
      this.auction = data;
      this.setCountDown(this.auction.endDate)
    })

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

  onClick(event: MouseEvent) {
    this.eventQueue.dispatch(new AppEvent(AppEventType.ClickedOnNotification, event));
    this.listenToEvent()
  }

  listenToEvent() {
    this.eventQueue.on(AppEventType.ClickedOnNotification).subscribe(event => this.handleEvent(event.payload));
  }

  handleEvent(event: MouseEvent) {
    // Do something with the click event
    console.log('this is event', event)
  }
  

}
