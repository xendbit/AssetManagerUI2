import { Component, OnInit } from '@angular/core';
import { IArtwork } from '../../interfaces/presentation/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentMsgToSlider: string;
  currentMsgToNftCards: IArtwork;
  constructor(public mainService: MainService) { }

  async ngOnInit() {
   
  
  }

}
