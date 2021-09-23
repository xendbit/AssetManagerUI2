import { navBar } from './../../interfaces/header/header.interface';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

import { AppController } from '../../../app.controller';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerData: navBar;
  constructor(public mainService: MainService) { }


  ngOnInit() {
    this.mainService.getHeader().subscribe((res: navBar) => {
      this.headerData = res;
    })
  }

}
