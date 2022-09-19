import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {DarkModeService} from 'angular-dark-mode';
import { MainService } from '../../services/main.service';
import { IMenuGroups } from '../footer/footer.interface';
import { INavButton } from './header.interface';
import { MetamaskService } from 'src/app/core/services/metamask.service';

declare var $: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() public headerInfo: IMenuGroups;
  @Input() public buttonsInfo: INavButton;
  @Output() displayStatus = new EventEmitter<any>();
  headerData: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""}
  buttonsData: INavButton = { "create": {"title": "Mint", "path": "mint"}, "wallet": { "title": "Connect Wallet", "path": "connect-wallet"}}
  account: string = 'Not connected';
  accountFound = false;
  reduceOpacity = false;
  userWallet: any;
  display: boolean = true;
  displaySidebar: boolean = false;
  displayConnect: boolean = false;
  darkMode$ = this.darkModeService.darkMode$;
  username: string = '';
  activeChain: string = ''; //
  constructor(public mainService: MainService, public metamaskService: MetamaskService, private darkModeService: DarkModeService) { }


  ngOnInit() {
    this.userWallet = localStorage.getItem('userWallet');
    this.activeChain = localStorage.getItem('currentChain');
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
      if (this.userWallet === 'fiat' && localStorage.getItem('account')) {
        this.accountFound = true;
        this.account = localStorage.getItem('account');
        this.username = localStorage.getItem('username');
      }
    }
    this.changeLogo();
  }

  onToggle(): void {
    this.darkModeService.toggle();
    this.changeLogo();
  }

  toggleLogin() {
    this.displayStatus.emit(this.display = !this.display);
    if (this.display && this.displaySidebar) {
      this.displaySidebar = false;
    }
  }

  toggleConnect() {
    this.displayConnect = true;
  }

  logOutFiat() {
    localStorage.clear();
    window.location.reload();
  }

  changeLogo() {
   const darkState = localStorage.getItem('dark-mode');
   if (darkState === 	'{"darkMode":false}') {
     this.headerInfo.logoPath = './assets/img/Niftylogo2.png';
   } else {
     this.headerInfo.logoPath = './assets/img/NiftyRow-logo-dark.png';
   }
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
