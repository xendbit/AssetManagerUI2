import { Component, OnInit } from '@angular/core';
import {IPresentation} from '../../core/components/slider/presentation.interface';
import {MainService} from '../../core/services/main.service';

@Component({
  selector: 'app-shore',
  templateUrl: './shore.component.html',
  styleUrls: ['./shore.component.scss']
})
export class ShoreComponent implements OnInit {

  slide: IPresentation;
  constructor(public mainService: MainService,) { }

  ngOnInit(): void {
    this.mainService.getPresentation().subscribe((res: IPresentation) => {
      this.slide = res;
    });
  }

}
