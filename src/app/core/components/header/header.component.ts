import {HttpClient} from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {DarkModeService} from 'angular-dark-mode';
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
  reduceOpacity = false;
  userWallet: any;
  displaySidebar: boolean = false;
  darkMode$ = this.darkModeService.darkMode$;

  constructor(public mainService: MainService, public metamaskService: MetamaskService, private darkModeService: DarkModeService) { }


  ngOnInit() {
    this.userWallet = localStorage.getItem('userWallet');
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        this.metamaskService.checkConnection().then(res => {
          if (res === undefined || !localStorage.getItem('account')) {
            this.accountFound = false;
          } else {
            this.accountFound = true;
            this.account = localStorage.getItem('account');
          }
        })
      }

      if (this.userWallet === 'WalletConnect' && localStorage.getItem('account')) {
        this.accountFound = true;
        this.account = localStorage.getItem('account');
      }
    }
  }

  onToggle(): void {
    this.darkModeService.toggle();
  }

  disconnectFromMetamask() {
    this.displaySidebar = false;
    this.metamaskService.disconnectFromClient();
  }

  onCheckboxChange(e) {
    this.reduceOpacity = !this.reduceOpacity;
  }

  disconnectFromWalletConnect() {
    this.displaySidebar = false;
    this.metamaskService.disconnectFromWalletConnect();
  }

  connectToWallectConnect() {
    this.metamaskService.tryWalletConnect();
  }

  toggleDark() {
    this
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['headerInfo']) {
        if (this.headerInfo !== undefined) {
          this.headerData = this.headerInfo;
          if (!this.accountFound) {
            this.headerData.menuGroup = this.headerData.menuGroup.filter(res => res.title !== 'Profile');
          }
        }
        if (this.buttonsInfo !== undefined) {
          this.buttonsData = this.buttonsInfo;
        }
    }
  }

  connectToMetamask() {
    this.metamaskService.openMetamask();
    this.ngOnInit();
  }

  switchChain(chain: string) {
    this.displaySidebar = false;
    localStorage.setItem('currentChain', chain);
    window.location.reload();
  }

}
