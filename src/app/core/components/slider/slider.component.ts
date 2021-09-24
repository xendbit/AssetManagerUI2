import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MainService } from '../../services/main.service';
import { IPresentation } from '../../interfaces/presentation/presentation.interface';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() public slider: IPresentation;
  public presentationData: IPresentation;
  constructor(public mainService: MainService) { 
 
   
  }

   ngOnInit() {
    this.mainService.getPresentation().subscribe((res: IPresentation) => {
      this.presentationData = res;
    })
    
  }
  

}
