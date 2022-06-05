import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { IPresentation } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuctionService } from 'src/app/core/services/auction.service';
import { UserActionsService } from 'src/app/core/services/userActions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @Input() showTransitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';

  @Input() hideTransitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';
  @Input() public presentation: any;

  transitions = '150ms cubic-bezier(0, 0, 0.2, 1)';

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  auctionTime: number;
  currentTime: number;
  countdownDay: any;
  countdownHours: any;
  countdownMinutes: any;
  countdownSeconds: any;
  auctionValue: number;
  auction: any;
  sellNowValue: number;
  sellNowValueNGN: number;
  ngxService: any;

  constructor( private mainService: MainService, 
    private router: Router,
    private auctionService: AuctionService,
    private clipboard: Clipboard,
    public userActions: UserActionsService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['presentation'].currentValue !== undefined && this.presentation !== null) {
      if (this.presentation.auctions !== undefined && this.presentation.auctions !== null ) {
        this.getUsdValue();
        this.setCountDown(this.presentation.auctions.endDate)
      }
    }
  }

  setCountDown(date) {
    this.auctionTime =  Math.floor(new Date(date).getTime());
    this.currentTime = Math.floor(new Date().getTime());
    let diff = Math.floor((this.auctionTime - this.currentTime) / 1000);
    // console.log('this =>',this.currentTime < this.auctionTime)
    const interval = 1000;
    this.countdownDay = this.mainService.getDays(diff);
    this.countdownHours = this.mainService.getHours(diff);
    this.countdownMinutes = this.mainService.getMinutes(diff);
    this.countdownSeconds = this.mainService.getSeconds(diff);
  }

  placeBid() {
    localStorage.setItem('auctionData', JSON.stringify(this.presentation.auctions));
    localStorage.setItem('artworkData', JSON.stringify(this.presentation));
    this.router.navigate(['/details/', this.presentation.tokenId, this.presentation.lastAuctionId]);
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.userActions.addSingle('global' ,'success', 'Copied', 'Copied to clipboard!');
  }

  getUsdValue() {
    this.auctionService.getUSDValue().subscribe(res => {
      this.sellNowValue = res['USD'] * this.presentation.auctions.sellNowPrice;
      this.auctionValue = res['USD'] * this.presentation.auctions.highestBid;
    }, err => {
      // this.ngxService.stop();
    })
  }

}
