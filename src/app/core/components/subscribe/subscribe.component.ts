import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {SubscribeService} from './subscribe.service';
import { UserActionsService } from '../../services/userActions.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeComponent implements OnInit {

  subscribeData: any = <any>{
    email: ''
  };

  constructor(
    private subscribeService: SubscribeService,
    private userActions: UserActionsService, 
    private toast: HotToastService,
    private ngxService: NgxUiLoaderService,) { }

  ngOnInit() {
  }

  subscribe(subscribeForm: NgForm) {
    if (this.userActions.validateEmail(this.subscribeData.email) !== true) {
      this.toast.error('Please make sure you entered a valid email.');
      return;
    }
    if (this.subscribeData.email === '') {
      this.toast.warning('Please enter your email address.')
      return;
    }
    this.ngxService.start();
    this.userActions.subscribeToNewsletter(this.subscribeData.email).subscribe((res: any) => {
      if (res.status === 'success') {
        this.ngxService.stop();
        this.toast.success(res.message)
        this.subscribeData.email = '';
      } else {
        this.ngxService.stop();
        this.toast.error(res.message);
      }
    }, err => {
      this.toast.error('There was an error while trying to subscribe, please try again.');
      this.ngxService.stop();
    })
  }
}
