import { AssetsService } from './../services/assets.service';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
declare var $: any;

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
  form: FormGroup;
  image: any;
  address: any;
  phone: any;

  constructor(public loginService: LoginService, public router: Router, public asset: AssetsService, public fb: FormBuilder) {
    this.form = fb.group({
      'image': this.image
  });
   }

  ngOnInit() {
    console.log(this.image);
    this.asset.getPassphrase().pipe(first()).subscribe(res => {
      console.log('this is response', res);
      this.passphrase = res['data'];
    })
  }

  register(register: NgForm) {
    if (this.image === undefined) {
      this.asset.showNotification('top', 'center', "Please upload a means of identification (National Id, Driver's licence, etc", 'danger');
      return;
    }
    console.log('this is it', register.value.bvn.length)
    const email = register.value.email;
    const password = register.value.password;
    const bvn = register.value.bvn;
    const firstName = register.value.firstName;
    const middleName = register.value.middleName;
    const lastName = register.value.lastName;
    const phone = register.value.phone;
    const address = register.value.address;
    if (email === undefined || password === undefined || bvn === undefined || firstName === undefined || middleName === undefined || lastName === undefined || phone === undefined || address === undefined) {
      this.asset.showNotification('top', 'center', "Please make sure all fields are completed and correct.", 'danger');
      return;
    }
    const body = {
      email: email,
      password: password,
      passphrase: this.passphrase,
      role: 0,
      bvn: bvn,
      image: this.image,
      address: address,
      phoneNumber: phone,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName
    }
    console.log('this is body', body);
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
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.asset.stopSpinner();
      this.asset.showNotification('top', 'center', this.error, 'danger');
    })
  }

  login() {
    this.router.navigateByUrl('/login')
  }


  uploadFile(event: any) {

    const file = (event.target as HTMLInputElement).files[0];
    if ( /\.(jpe?g|gif|png)$/i.test(file.name) === false  ) {
      this.asset.showNotification('bottom', 'center', 'please choose an Image!', 'danger')
      event.srcElement.value = null;
    } else {
      this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    }

    const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = rs => {
                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];

                    console.log(img_height, img_width);


                    
                        const imgBase64Path = e.target.result;
                        this.image = imgBase64Path;
                        console.log('this is image path', imgBase64Path)
                        // this.previewImagePath = imgBase64Path;
                };
            };

            reader.readAsDataURL(event.target.files[0]);
  }

}
