import { Component, OnInit, Input } from '@angular/core';
import { IArtwork } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { interval } from 'rxjs/internal/observable/interval';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-nftcard',
  templateUrl: './nftcard.component.html',
  styleUrls: ['./nftcard.component.scss']
})
export class NFTCardComponent implements OnInit {
  @Input() public artwork: IArtwork;
  count = 10;
  timeout = setInterval(() => {
    if (this.count > 0) {
      this.count -= 1;
    } else {
      clearInterval(this.timeout);
    }
  }, 1000);

  private maxValue = 10;
  countDown$ = interval(500).pipe(
    map(value => this.maxValue - value),
    takeWhile(x => x >= 0)
  );

  constructor(public mainService: MainService) { }

  ngOnInit() {   

  }

}
