import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MainService } from '../../services/main.service';
import { IPresentation } from '../../interfaces/main.interface';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit {
  @Input() public msgFromParent: string;
  presentationData: IPresentation; 
  constructor(public mainService: MainService) { }

  ngOnInit() {
    this.mainService.getPresentation().subscribe((response: IPresentation) => { 
      this.presentationData = response;
      console.log('this is response', this.presentationData)
    })
  }

}
