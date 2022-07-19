import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HotToastService } from '@ngneat/hot-toast';
import { UserActionsService } from '../../services/userActions.service';
import { MetamaskService } from '../../services/metamask.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  display: boolean = false;
  userData: any = <any>{
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    webUrl: ''

  };
  privateKey: string = '';
  registered: boolean = true;
  @Input() public displayValue: boolean;
  @Output() displayStatus = new EventEmitter<any>();
  constructor(
    private userActions: UserActionsService,
    private toast: HotToastService,
    private clipboard: Clipboard,
    private ngxService: NgxUiLoaderService,
    private metamaskService: MetamaskService) {

    }

  ngOnInit(): void {
    this.privateKey = this.metamaskService.createWalletForBuyer().privateKey;
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['displayValue'].currentValue !== undefined) {
      this.display = this.displayValue;
    }
  }

  changeToLogin() {
    this.displayStatus.emit(true);
  }

  registerUser() {
    let walletAddress = this.metamaskService.createWalletForBuyer().buyerAddress;
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
    if (this.userActions.checkContainsNumber(this.userData.firstName) !== true
    || this.userActions.checkContainsNumber(this.userData.lastName) !== true ||
    this.userActions.checkContainsNumber(this.userData.username) !== true ||
    this.userActions.checkContainsNumber(this.userData.webUrl) !== true) {
      this.toast.error('Please make sure all fields are filled correctly.');
      return;
    }
    this.ngxService.start()
    let userData = {
      "firstName": this.userData.firstName,
      "lastName": this.userData.lastName,
      "username": this.userData.username,
      "password": this.userData.password,
      "email": this.userData.email,
      "walletAddress": walletAddress,
      "about": "Welcome to Nifty Row! Click to edit me.",
      "webUrl": this.userData.webUrl,
      "social": {"twitterUrl": "www.twitter.com/xendbit", "facebookUrl": "www.facebook.com/xendbit",
      "youtubeUrl": "www.youtube.com/xendbit", "telegramUrl": "www.telegram.com/xendbit"},
      "photo": {
        "displayImage": '11111111111',
        "coverImage": '11111111111'
      }
    }

    this.userActions.registerUser(userData).subscribe((res: any) => {
      if (res.status === 'success') {
        this.ngxService.stop();
        this.toast.success(res.message);
        this.privateKey = this.metamaskService.createWalletForBuyer().privateKey;
      } else {
        this.ngxService.stop();
        this.toast.error(res.message[0]);
      }
    }, err => {
      this.toast.error('There was an error while trying to create your account, please try again.');
      this.ngxService.stop();
    })
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.toast.success('Copied to clipboard!')
    this.displayStatus.emit(true);
  }

}
