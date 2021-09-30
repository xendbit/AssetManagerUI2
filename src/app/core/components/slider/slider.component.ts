import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { MainService } from '../../services/main.service';
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
  constructor(public mainService: MainService) { 
 
   
  }

   ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.slider ){
      let endDate =   this.slider.filter(slide => {
        if (slide['type'] === 'Auction') {
          return slide['endDate'];
        }
      })
      this.setCountDown(endDate);
    }
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
