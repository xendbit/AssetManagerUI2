import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MainService } from '../../services/main.service';
import { AppController } from '../../../app.controller';
import { IMenuGroups } from '../footer/footer.interface';
import { INavButton } from './header.interface';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';

declare var $: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() public headerInfo: IMenuGroups;
  @Input() public buttonsInfo: INavButton;
  headerData: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""}
  buttonsData: INavButton = { "create": {"title": "Mint", "path": "mint"}, "wallet": { "title": "Connect Wallet", "path": "connect-wallet"}}
  account: string = 'Not connected';
  accountFound = false;
  constructor(public mainService: MainService, public metamaskService: MetamaskService) { }


  ngOnInit() {
    if (localStorage.getItem('account')) {
      this.accountFound = true;
      this.account = localStorage.getItem('account');
    } else {
      this.accountFound = false;
    }
 
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

  connectToMetamask() {
    this.metamaskService.openMetamask().then(res => {
      this.account = res.account;
    });
  }

}
