import { Component, OnInit, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
    mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  userId: number;
  role: number;

  constructor(location: Location,  private element: ElementRef, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('userId')) {
      this.userId = parseInt(localStorage.getItem('userId'));
      this.role = parseInt(localStorage.getItem('role'));
      console.log('this is role', this.role)
    }
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigateByUrl('/login');
  }

  goToAllAssets(page) {
    this.router.navigateByUrl('/assets', { state : { from: page} });
  }
 

}
