import { AssetsService } from './../services/assets.service';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loading = false;
    submitted = false;
    returnUrl: string;
    email: string;
    password: string;

  constructor(
        private route: ActivatedRoute,
        private router: Router, public loginService: LoginService, public assetService: AssetsService
  ) { }

  ngOnInit() {

  // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  onSubmit(loginForm: NgForm) {
    this.submitted = true;

    // stop here if form is invalid

    const email = loginForm.value.email;
    const password = loginForm.value.password;

    this.loading = true;
    this.assetService.showSpinner();
    this.loginService.login(email, password)
        .pipe(first())
        .subscribe(
            data => {
              if (data['status'] == 'success') {
                console.log('this is data', data);
                localStorage.setItem('accountNumber', data['data']['ngncAccountNumber']);
                localStorage.setItem('firstName', data['data']['firstName'])
                localStorage.setItem('firstName', data['data']['middleName'])
                localStorage.setItem('userId', data['data']['id'])
                localStorage.setItem('role', data['data']['role'])
                this.assetService.stopSpinner();
                if (data['data']['role'] === 0) {
                  console.log('i am an investor')
                  this.router.navigateByUrl('/home');
                } else if (data['data']['role'] === 1)
                {
                  this.router.navigateByUrl('/admin-dashboard');
                } else if ( data['data']['role'] === 2) {
                  this.router.navigateByUrl('/issuer-dashboard');
                }
              } else {
                this.assetService.stopSpinner();
                this.assetService.showNotification('top', 'center', 'there has been an error while trying to log in, please confirm your credentials and try again', 'danger');
              }
             
            },
            error => {
                console.log('this is error', error)
                this.loading = false;
                this.assetService.stopSpinner();
            }); 

  }

  register() {
    this.router.navigateByUrl('/login')
  }

}