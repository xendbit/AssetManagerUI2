import { AssetsService } from './../../services/assets.service';
import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import * as Web3 from 'web3';


declare let require: any;
declare let window: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    userId: number;
    role: number;
  assets: any;
  error: any;
  provider: any;
  accounts: string[];
  accountStatusSource: any;
  account: any;
  hasMetaMask: boolean;
  isConnected: boolean;
  metamask: any;
  balance: any;
  displayedData: string;

    constructor(location: Location,  private element: ElementRef, private router: Router, public assetService: AssetsService) {
      this.location = location;
          this.sidebarVisible = false;
          if (window.ethereum.isMetaMask === true) {
            this.metamask = window.ethereum;
            this.hasMetaMask = true;
          } else {
            this.hasMetaMask = false;
          }
        
    }

    async ngOnInit(){
        this.assetService.getMetamaskInfo().then(data => {
          this.accounts = data.accounts;
          this.account = data.account;
          this.displayedData = data.displayedData;
          this.balance = data.balance;
          if (window.ethereum.isConnected() && this.account !== undefined) {
            this.isConnected = true;
          } else {
            this.isConnected = false;
          }
        
        })
          // this.getAssets();
          this.getBalance();
    }


    getBalance(){
      this.assetService.getAccountInfo().then(res => {
        console.log('res', res['balance']);
      })

    }

    logout() {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('accountNumber');
        localStorage.removeItem('firstName')
        localStorage.removeItem('firstName')
        localStorage.removeItem('id')
        this.router.navigateByUrl('/login');
      }
    
      goToAllAssets(page) {
        this.router.navigateByUrl('/assets', { state : { from: page} });
      }

      async connectToMetamask() {
        if (this.hasMetaMask = false) {
          this.assetService.showNotification('top','center','Please install or create a metamask account to connect to your wallet', 'danger');
          return;
        } else {
          const accounts = await  this.metamask.request({ method: 'eth_requestAccounts' });
          this.accounts = accounts;
          this.account = accounts[0];
          this.displayedData = this.account.substring(0, 8) + 'xxxxx' + this.account.slice(this.account.length - 8)

          const balance = await  this.metamask.request({"jsonrpc":"2.0", method: 'eth_getBalance', params:  [this.account] }).then(res => {
            this.balance =  window.web3.fromWei(res, 'ether');
          })
          this.isConnected = true;
        }
  
      }

     

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    // getAssets() {
    //   this.assetService.showSpinner();
    //   this.assetService.getAllAssets().subscribe(data => {
    //     this.assets = data['data']['items'];
    //     console.log('this is assets, ', data['data']['items']);
    //     let init = []
    //     let second = []
    //     this.assets.forEach(element => {
    //       if (element.market === 0 && element.approved === 1 ) {
    //         init.push(element);
    //       } else if (element.market === 1 && element.approved === 1) {
    //         second.push(element);
    //       }
    //     });
    //     this.assetService.stopSpinner();
     
    //   }, err => {
    //     this.assetService.stopSpinner();
    //     console.log(err.error.data.error);
    //     this.error = err.error.data.error;
    //   },
    //   () => { 
    //     this.assetService.stopSpinner();
    //   });
    // }
  
}
