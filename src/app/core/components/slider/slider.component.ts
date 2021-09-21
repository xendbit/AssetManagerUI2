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
  public presentationData: IPresentation;
  constructor(public mainService: MainService) { 
 
   
  }

  async ngOnInit() {
 
    
  }

  async ngOnChanges() {
    await this.mainService.setPresentation().subscribe((res: IPresentation) => {
      this.presentationData = res;
      console.log('this is data', this.presentationData)
    })
    console.log('this is data', this.presentationData)
  }
  

}
