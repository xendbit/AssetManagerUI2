import { AssetsService } from './../services/assets.service';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

declare var genwallet: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  passphrase: string;
  error: any;
  email: string;
  password: string;
  bvn: string;
  firstName: string;
  middleName: string;
  lastName: string;

  constructor(public loginService: LoginService, public router: Router, public asset: AssetsService) { }

  ngOnInit() {
    this.asset.getPassphrase().pipe(first()).subscribe(res => {
      console.log('this is response', res);
      this.passphrase = res['data'];
    })
    
    console.log(this.passphrase);
  }

  register(register: NgForm) {
    const email = register.value.email;
    const password = register.value.password;
    const bvn = register.value.bvn;
    const firstName = register.value.firstName;
    const middleName = register.value.middleName;
    const lastName = register.value.lastName;
    const body = {
      email: email,
      password: password,
      passphrase: this.passphrase,
      role: 0,
      bvn: bvn,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName
    }
    this.asset.showSpinner();
    this.loginService.register(body).pipe(first()).subscribe(res => {
      //localStorage.setItem('passhphrase', this.passphrase);
      console.log('==>', res);
      if (res['status'] === 'success') {
        this.asset.stopSpinner();
        this.asset.showNotification('top', 'center', 'User has been successfully registered', 'success');
        this.router.navigateByUrl('/login')
      }
    }, err => {
      console.log(err.error.error);
      this.error = err.error.error
      this.asset.stopSpinner();
      this.asset.showNotification('top', 'center', 'there has been an error, please confirm you filled all forms correctly and try again.', 'danger');
    })
  }

  login() {
    this.router.navigateByUrl('/login')
  }


}
