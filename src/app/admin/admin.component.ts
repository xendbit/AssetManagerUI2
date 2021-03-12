import { AssetsService } from './../services/assets.service';
import { AdminService } from './../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  firstName: any;
  lastName: any;
  middleName: any;
  email: any;
  password: any;
  error: any;
  passphrase: any;
  bvn: any;

  constructor(public adminService: AdminService, public assetService: AssetsService) { }

  ngOnInit(): void {
    this.assetService.getPassphrase().pipe(first()).subscribe(res => {
      console.log('this is response', res);
      this.passphrase = res['data'];
    })
  }

  register(registerForm: NgForm) {
    const password = registerForm.value.password;
    const email = registerForm.value.email
    const firstName = registerForm.value.firstName;
    const middleName = registerForm.value.middleName;
    const lastName = registerForm.value.lastName;
    const bvn = registerForm.value.bvn;
    console.log('this is email, ', email)
    const body = {
      'firstName': firstName,
      'middleName': middleName,
      'lastName': lastName,
      'bvn': bvn,
      'email': email,
      'password': password,
      'passphrase': this.passphrase,
      'role': 1,
      'phoneNumber': '08164079881',
      'address': 'jsdjsdsj'
    }
    this.assetService.showSpinner();
    this.adminService.registerAdmin(body).subscribe(res => {
      console.log('this is response', res);
      if (res['status'] === 'success') {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'Admin registered successfully', 'success');
      } else {
        this.assetService.stopSpinner();
        this.assetService.showNotification('bottom', 'center', 'there has been an error while trying to add admin, please try again later.', 'danger')
      }
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    });
    
  }

}
