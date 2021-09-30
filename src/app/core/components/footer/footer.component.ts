import { Component, OnInit, Input } from '@angular/core';
import { MainService } from '../../services/main.service';
import { IMenuGroups } from './footer.interface';
import { INavButton } from '../header/header.interface';




@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() public footerData: IMenuGroups;
  @Input() public buttonsData: INavButton;
  constructor(public mainService: MainService) { }

  ngOnInit() {
   
  }

}
