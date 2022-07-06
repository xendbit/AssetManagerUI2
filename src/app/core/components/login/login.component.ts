import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HotToastService } from '@ngneat/hot-toast';
import { UserActionsService } from '../../services/userActions.service';
import { MetamaskService } from '../../services/metamask.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  display: boolean = false;
  userData: any = <any>{
    password: '',
    email: ''

  };
  @Input() public displayVal: boolean;
  @Output() displayRegisterStatus = new EventEmitter<any>();
  constructor( 
    private userActions: UserActionsService, 
    private toast: HotToastService,
    private ngxService: NgxUiLoaderService,
    private metamaskService: MetamaskService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['displayVal'].currentValue !== undefined) {
      this.display = this.displayVal;
    }
  }

  changeToRegister() {
    this.displayRegisterStatus.emit(true);
  }

  login() {
    if (this.userActions.validateEmail(this.userData.email) !== true) {
      this.toast.error('Please make sure you entered a valid email.');
      return;
    }
    if (this.userData.email === '') {
      this.toast.warning('Please enter your email address.')
      return;
    }
    if (this.userData.password === '') {
      this.toast.warning('Password cannot be empty.')
      return;
    }

    this.ngxService.start()
    let userData = {
      "password": this.userData.password,
      "email": this.userData.email
    }

    this.userActions.loginUser(userData).subscribe((res: any) => {
      if (res.status === 'success') {
        this.ngxService.stop();
        this.toast.success(res.message)
        console.log('res', res)
      } else {
        this.ngxService.stop();
        this.toast.error(res.message);
      }
    }, err => {
      console.log('here', err)
      this.toast.error(err['error']['message']['error']);
      this.ngxService.stop();
    })

  }

}
