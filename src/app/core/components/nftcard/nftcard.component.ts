import { Component, OnInit, Input } from '@angular/core';
import { IArtwork, IAuction } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { interval } from 'rxjs/internal/observable/interval';
import { map, takeWhile } from 'rxjs/operators';
import { AuctionService } from '../../services/auction.service';

@Component({
  selector: 'app-nftcard',
  templateUrl: './nftcard.component.html',
  styleUrls: ['./nftcard.component.scss']
})
export class NFTCardComponent implements OnInit {
  @Input() public artwork: IArtwork;
  count = 10;
  timeout: any;

  private maxValue = 10;
  countDown$ = interval(500).pipe(
    map(value => this.maxValue - value),
    takeWhile(x => x >= 0)
  );
  countdown: string;
  countdownDay: number;
  countdownHours: number;
  countdownMinutes: number;
  countdownSeconds: number;
  distance: number;

  constructor(public mainService: MainService, public auctionService: AuctionService) { }

  ngOnInit() {  
    this.mainService.fetchSingleArtwork(this.artwork.tokenId).subscribe((res: IArtwork) => {
      this.auctionService.fetchAuctionFromMain(res.tokenId, res.lastAuctionId).subscribe((data: IAuction) => {
        this.setCountDown(data.endDate)
      })
    })
  }

  setCountDown(date) {
   // Set the date we're counting down to
   var end = new Date(date).getTime();
   var _second = 1000;
   var _minute = _second * 60;
   var _hour = _minute * 60;
   var _day = _hour * 24;
   var timer;

   setInterval(() => {
      var now = new Date().getTime();
       this.distance = end - now;
       if (this.distance < 0) {
           clearInterval(timer);
           this.countdown = 'EXPIRED';
           return;
       }
       var days = Math.floor(this.distance / _day);
       var hours =  Math.floor((this.distance % _day) / _hour );
       var minutes = Math.floor((this.distance % _hour) / _minute);
       var seconds = Math.floor((this.distance % _minute) / _second);

       this.countdownDay = days;
       this.countdownHours += hours;
       this.countdownMinutes += minutes;
       this.countdownSeconds += seconds;
      }, 1000)
  }
  

}
