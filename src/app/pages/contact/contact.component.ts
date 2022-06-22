import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HotToastService } from '@ngneat/hot-toast';
import { UserActionsService } from 'src/app/core/services/userActions.service';

@Component({
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactData: any = <any>{
    fullName: '',
    email: '',
    subject: '',
    message: ''
  };
  constructor(
    private toast: HotToastService,
    private ngxService: NgxUiLoaderService,
    private userActions: UserActionsService) { }

  ngOnInit(): void {
  }

  submitContact() {
    if (this.userActions.validateEmail(this.contactData.email) !== true) {
      this.toast.error('Please make sure you entered a valid email.');
      return;
    }
    if (this.userActions.checkContainsNumber(this.contactData.fullName) !== true) {
      this.toast.error('Please make sure you entered a valid full name.');
      return;
    }
    if (this.contactData.fullName !== '' && this.contactData.email !== ''
    && this.contactData.subject !== '' && this.contactData.message !== '') {
      this.ngxService.start()
      const contactUs = {
        "fullName": this.contactData.fullName,
        "email": this.contactData.email,
        "Subject": this.contactData.subject,
        "message": this.contactData.message
      }
      this.userActions.contactUs(contactUs).subscribe((res: any) => {
        if (res.status === 'success') {
          this.ngxService.stop();
          this.toast.success(res.message)
          this.contactData = {
            fullName: '',
            email: '',
            subject: '',
            message: ''
          };
        } else {
          this.ngxService.stop();
          this.toast.error(res.message);
        }
      }, err => {
        this.toast.error('There was an error while trying to submit this form, please try again.');
        this.ngxService.stop();
      })
    } else {
      this.toast.error('Please fill all the fields before submission');
    }

  }

}
