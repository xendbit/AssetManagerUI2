import { AssetsService } from './../../services/assets.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';

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

    constructor(location: Location,  private element: ElementRef, private router: Router, public assetService: AssetsService) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
        if (localStorage.getItem('userId')) {
            this.userId = parseInt(localStorage.getItem('userId'));
            this.role = parseInt(localStorage.getItem('role'));
            console.log('this is role', this.role)
          }
          this.getAssets();
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

    getAssets() {
      this.assetService.showSpinner();
      this.assetService.getAllAssets().subscribe(data => {
        this.assets = data['data']['items'];
        console.log('this is assets, ', data['data']['items']);
        let init = []
        let second = []
        this.assets.forEach(element => {
          if (element.market === 0 && element.approved === 1 ) {
            init.push(element);
          } else if (element.market === 1 && element.approved === 1) {
            second.push(element);
          }
        });
        this.assetService.stopSpinner();
     
      }, err => {
        this.assetService.stopSpinner();
        console.log(err.error.data.error);
        this.error = err.error.data.error;
      },
      () => { 
        this.assetService.stopSpinner();
      });
    }
  
}
