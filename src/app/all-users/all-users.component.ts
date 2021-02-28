import { AssetsService } from './../services/assets.service';
import { AdminService } from './../services/admin.service';
import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  Id: any;
  email: any;
  lastName: any;
  firstName: any;
  role: any;
  investor: any;
  assets: any;
  primaryMarket: any[];
  admin: any;
  issuer: any;
  
 

  constructor(public activatedRoute: ActivatedRoute, public adminService: AdminService, public assetService: AssetsService) { }

  ngOnInit(): void {
    this.getAssets();
    this.activatedRoute.paramMap
    .subscribe(
        () => {
            if (window.history.state.id) {
                this.Id = window.history.state.id;
                this.firstName = window.history.state.firstName;
                this.lastName = window.history.state.lastName;
                this.email = window.history.state.email;
                this.role = window.history.state.role;
                if (this.role === 0 ) {
                  this.getInvestors();
                } else if ( this.role === 1) {
                  this.getAdmin();
                } else if (this.role === 2) {
                  this.getIssuer();
                }
               
            }
        },
        err => {
            console.log(err);
        },
        () => { }
    );
  }

  getInvestors() {
    this.adminService.getAllUsers(0).subscribe( res => {
      console.log('this is investor', res);
      let investors = res['data'];
      let init = [];
      investors.forEach(element => {
        if (element.id === this.Id && element.role === 0 ) {
          init.push(element);
        } 
      })
      
      this.investor = init[0];
      console.log('this is it', this.investor);
    })
  }

  getAdmin() {
    this.adminService.getAllUsers(1).subscribe( res => {
      console.log('this is investor', res);
      let investors = res['data'];
      let init = [];
      investors.forEach(element => {
        if (element.id === this.Id && element.role === 1 ) {
          init.push(element);
        } 
      })
      
      this.admin = init[0];
    })
  }

  getIssuer() {
    this.adminService.getAllUsers(2).subscribe( res => {
      console.log('this is investor', res);
      let investors = res['data'];
      let init = [];
      investors.forEach(element => {
        if (element.id === this.Id && element.role === 2 ) {
          init.push(element);
        } 
      })
      
      this.issuer = init[0];
    })
  }


  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      let primary = [];
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          primary.push(element);
        }
      });
    
      this.primaryMarket =  primary ;
      this.assetService.stopSpinner();
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => { 
      this.assetService.stopSpinner();
    }
    );
  }


}
