import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  @Input() auctionLength;
  @Input() auction;
  @Input() foundNetwork: {};
  @Input() fetched: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
