import { AssetsService } from '../../services/assets.service';
import { LoginService } from '../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-issuer',
  templateUrl: './issuer.component.html',
  styleUrls: ['./issuer.component.css']
})
export class IssuerComponent implements OnInit {
  name: any;
  email: any;
  password: any;
  error: any;
  passphrase: string;
  bvn: string;
  firstName: string;
  middleName: string;
  lastName: string;


  constructor(public loginService: LoginService, public assetService: AssetsService) { }

  ngOnInit(): void {
    this.assetService.getPassphrase().pipe(first()).subscribe(res => {
      console.log('this is response', res);
      this.passphrase = res['data'];
    })
  }


  register(registerForm: NgForm) {
    const email = registerForm.value.email;
    const password = registerForm.value.password;
    const bvn = registerForm.value.bvn;
    const firstName = registerForm.value.firstName;
    const middleName = registerForm.value.middleName;
    const lastName = registerForm.value.lastName;
    const body = {
      email: email,
      password: password,
      passphrase: this.passphrase,
      role: 2,
      bvn: bvn,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      phoneNumber: '08164079881',
      address: 'jsdjsdsj'
    }
    this.assetService.showSpinner();
    this.loginService.register(body).subscribe(res => {
      if (res['status'] === 'success') {
        this.assetService.stopSpinner();
        this.assetService.showNotification('top', 'center', 'Issuer registered successfully', 'success');
      } else {
        this.assetService.stopSpinner();
        this.assetService.showNotification('bottom', 'center', 'there has been an error while trying to add issuer, please try again later.', 'danger')
      }
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    });
    
  }

}
