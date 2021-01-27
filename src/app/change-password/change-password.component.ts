import { Component, OnInit } from '@angular/core';
import { AssetsService } from './../services/assets.service';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  submitted: boolean;
  password: any;
  retypePassword: any;
  token: any;

  constructor(private route: ActivatedRoute,
    private router: Router, public loginService: LoginService, public assetService: AssetsService) { }

  ngOnInit(): void {
  }

  onSubmit(loginForm: NgForm) {
    const password = loginForm.value.password;
    const retyped = loginForm.value.retypePassword;
    const token = loginForm.value.token;
    if (password !== retyped) {
      this.assetService.showNotification('top', 'center', 'Passwords do not match!', 'danger');
      return
    } else {
      this.submitted = true;
      const body = {
        token: token,
        password: password
      }
      this.loginService.changePassword(body).subscribe(res => {
        console.log('this is response', res);
        if (res['status'] === 'success') {
          this.assetService.showNotification('top', 'center', 'Password changed successfully!', 'success');
          this.router.navigateByUrl('/change-password');
        }
      });
    }

  }

}
