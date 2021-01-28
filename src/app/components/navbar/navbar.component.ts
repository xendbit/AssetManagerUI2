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

    constructor(location: Location,  private element: ElementRef, private router: Router) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
        if (localStorage.getItem('userId')) {
            this.userId = parseInt(localStorage.getItem('userId'));
            this.role = parseInt(localStorage.getItem('role'));
            console.log('this is role', this.role)
          }
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
}
