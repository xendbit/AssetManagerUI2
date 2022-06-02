import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {DarkModeService} from 'angular-dark-mode';
import { MainService } from '../../services/main.service';
import { IMenuGroups } from './footer.interface';
import { INavButton } from '../header/header.interface';
import { NgxSpinnerService } from 'ngx-spinner';




@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerData: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""};
  buttonsData: INavButton = { "create": {"title": "Create", "path": ""}, "wallet": { "title": "Connect Wallet", "path": ""}}
  @Input() public footerInfo: IMenuGroups;
  // @Input() public buttonsInfo: INavButton;
  darkMode$ = this.darkModeService.darkMode$;

  constructor(public mainService: MainService, private spinner: NgxSpinnerService, private darkModeService: DarkModeService) { }

  ngOnInit() {
    this.changeLogo();
    this.darkMode$.subscribe(state => state ? this.footerInfo.logoPath = './assets/img/NiftyRow-logo-dark.png' : this.footerInfo.logoPath = './assets/img/Niftylogo2.png');
  }


  ngOnChanges(changes: SimpleChanges) {
    // this.spinner.show();
    if (changes['footerInfo']) {
        if (this.footerInfo !== undefined) {
          this.footerData = this.footerInfo;
        }
        // if (this.buttonsInfo !== undefined) {
        //   this.buttonsData = this.buttonsInfo;
        // }
        this.spinner.hide();
    }

  }

  changeLogo() {
    const darkState = localStorage.getItem('dark-mode');
    if (darkState === 	'{"darkMode":false}') {
      this.footerInfo.logoPath = './assets/img/Niftylogo2.png';
    } else {
      this.footerInfo.logoPath = './assets/img/NiftyRow-logo-dark.png';
    }
  }
}
