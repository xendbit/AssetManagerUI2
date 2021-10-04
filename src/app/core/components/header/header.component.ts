import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() public headerInfo: IMenuGroups;
  @Input() public buttonsInfo: INavButton;
  headerData: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""}
  buttonsData: INavButton = { "create": {"title": "", "path": ""}, "wallet": { "title": "", "path": ""}}
  constructor(public mainService: MainService) { }


  ngOnInit() {
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['headerInfo']) {
        if (this.headerInfo !== undefined) {
          this.headerData = this.headerInfo;
        }
        if (this.buttonsInfo !== undefined) {
          this.buttonsData = this.buttonsInfo;
        }
    }   
  }

}
