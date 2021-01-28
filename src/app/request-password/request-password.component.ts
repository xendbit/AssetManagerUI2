import { AssetsService } from './../services/assets.service';
import { LoginService } from '../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.css']
})
export class RequestPasswordComponent implements OnInit {
  loading = false;
  submitted = false;
  returnUrl: string;
  email: string;
  password: string;


  constructor(  private route: ActivatedRoute,
    private router: Router, public loginService: LoginService, public assetService: AssetsService) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(loginForm: NgForm) {
    const userEmail = loginForm.value.email;
    this.submitted = true;
    const body = {
      email: userEmail
    }
    this.loginService.requestToken(body).subscribe(res => {
      console.log('this is response', res);
      if (res['status'] === 'success') {
        this.assetService.showNotification('top', 'center', 'Request to change password sent successfully!', 'success');
        this.router.navigateByUrl('/change-password');
      }
    })
    //this.router.navigateByUrl('/issuer-dashboard')

    // stop here if form is invalid

    /* const email = loginForm.value.email;
    const password = loginForm.value.password;
    console.log('this is it,' , email)

    this.loading = true;
    this.loginService.login(email, password)
        .pipe(first())
        .subscribe(
            data => {
              console.log('this is data', data);
              localStorage.setItem('userId', data['id'])
                this.router.navigateByUrl('/');
            },
            error => {
                console.log('this is error', error)
                this.loading = false;
            });  */

  }

  register() {
    this.router.navigateByUrl('/login')
  }

}
