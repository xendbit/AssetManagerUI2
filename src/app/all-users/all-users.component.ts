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
  
 

  constructor(public activatedRoute: ActivatedRoute, public adminService: AdminService) { }

  ngOnInit(): void {
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
      console.log('this is it', init);
    })
  }


}
