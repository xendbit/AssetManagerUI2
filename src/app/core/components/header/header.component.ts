import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AppController } from '../../../app.controller';
import { IMenuGroups } from '../footer/footer.interface';
import { INavButton } from './header.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() public headerData: IMenuGroups;
  @Input() public buttonsData: INavButton;
  constructor(public mainService: MainService) { }


  ngOnInit() {

  }

}
