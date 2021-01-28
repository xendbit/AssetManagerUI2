import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/assets', title: 'All Assets',  icon:'card_travel', class: '' },
    { path: '/buy', title: 'Buy Assets',  icon:'shopping_basket', class: '' },
    { path: '/sell', title: 'Sell Assets',  icon:'swap_vertical_circle', class: '' },
    { path: '/orders', title: 'My Orders',  icon:'format_align_center', class: '' },
    { path: '/request-password', title: 'Reset Password',  icon:'equalizer', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  opened: boolean
  isMobile: boolean;

  constructor(public location: Location) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.isMobileMenu();
  }
  isMobileMenu() {
      if ($(window).width() > 900) {
          this.isMobile = false
          return false;
      }
      this.isMobile = true;
      return true;
  };

  sideVisibility(sidenav) {
    sidenav.toggle()
  }
  isMaps(path){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
        return false;
    }
    else {
        return true;
    }
}
}
