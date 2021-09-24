import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IArtwork } from '../../interfaces/presentation/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-nftcard',
  templateUrl: './nftcard.component.html',
  styleUrls: ['./nftcard.component.scss']
})
export class NFTCardComponent implements OnInit {
  @Input() public artwork: IArtwork;
  

  constructor(public mainService: MainService) { }

  ngOnInit() {
    
  }

}
