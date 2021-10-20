import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  navButtons: unknown;
  headerInfo: any;

  constructor(public mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.getNavButtons().subscribe(res => {
      this.navButtons = res;
    });
    this.mainService.getHeader().subscribe(res => {
      this.headerInfo = res;
    })
  }

}
