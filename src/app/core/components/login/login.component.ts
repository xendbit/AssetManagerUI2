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
  userWallet: any;
  accountFound = false;
  username: string = '';
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
    this.userWallet = localStorage.getItem('userWallet');
    if (changes['displayVal'].currentValue !== undefined) {
      this.display = this.displayVal;
    }
    if (this.userWallet !== null) {
      if (this.userWallet === 'fiat' && localStorage.getItem('account')) {
        this.accountFound = true;
        this.username = localStorage.getItem('username');
      }
    }
  }

  changeToRegister() {
    this.displayRegisterStatus.emit(true);
  }

  logOutFiat() {
    localStorage.clear();
    window.location.reload();
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
        localStorage.setItem('account', res.data.walletAddress);
        localStorage.setItem('userWallet', 'fiat');
        localStorage.setItem('email', res.data.email);
        localStorage.setItem('username', res.data.username);
        this.toast.success(res.message)
        window.location.reload();
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
