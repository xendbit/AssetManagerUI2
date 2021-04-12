import { Router } from '@angular/router';
import { AssetsService } from './../services/assets.service';
import { NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-issue-assets',
  templateUrl: './issue-assets.component.html',
  styleUrls: ['./issue-assets.component.css']
})
export class IssueAssetsComponent implements OnInit {
  symbol: string;
  description: string;
  totalSupply: any;
  issuingPrice: any;
  error: any;
  form: FormGroup;
  image: any;
  title: any;
  artist: any;
  shares: any;
  assets: any;
  totalItems: any;
  unapproved: any[];
  totalApproved: number;
  approved: any[];
  exclusive: any;
  mp3: any;
  mp4: any;
  tempImage: string;

  constructor(public assetService: AssetsService, public fb: FormBuilder, public router: Router, private domSanitizer: DomSanitizer) {
    this.form = fb.group({
      'description': this.description,
      'symbol': this.symbol,
      'issuingPrice': this.issuingPrice,
      'image': this.image,
      'totalSupply': this.totalSupply,
      'artTitle': this.title,
      'artistName': this.artist,
      'availableShares': this.shares
  });
   }

  ngOnInit(): void {
    this.tempImage = '/assets/img/nft.png';
    this.getUserAssets();
  }

  submit(radioGroup) {
    console.log('this is exclusive', radioGroup.value);
    this.exclusive = radioGroup.value;
    this.description = this.form.get('description').value;
    this.symbol = this.form.get('symbol').value;
    this.issuingPrice = parseInt(this.form.get('issuingPrice').value);
    this.totalSupply = parseInt(this.form.get('totalSupply').value);
    this.shares = parseInt(this.form.get('availableShares').value);
    this.artist = this.form.get('artistName').value;
    this.title = this.form.get('artTitle').value;
    if (this.exclusive === true) {
      this.shares = 1;
      this.totalSupply = 1;
      console.log('this is shares', this.shares);
    }
    if (this.title === null || this.artist === null || this.symbol === null || this.description === null || this.totalSupply === null || this.shares === null) {
      this.assetService.showNotification('bottom','center','Please fill all fields before submission.', 'danger');
      return;
    }
    if (this.shares > this.totalSupply && this.exclusive === false) {
      this.assetService.showNotification('bottom','center','Available shares cannot be more than quantity. Please correct and try again', 'danger');
      return
    } else if (this.shares > this.totalSupply && this.exclusive === true) {
      this.assetService.showNotification('bottom','center','Available shares cannot be more than quantity. Please correct and try again', 'danger');
      return
    }
    const issueId = localStorage.getItem('userId');
    console.log('this is issueId',  new Date().getFullYear())
    const body = {
      description: this.description,
      symbol: this.symbol,
      totalSupply: this.totalSupply,
      issuingPrice: this.issuingPrice,
      issuerId: issueId,
      artistName: this.artist,
      titleOfWork: this.title,
      image: this.image,
      sharesAvailable: this.shares,
      commission: 500,
      price: this.issuingPrice,
      createdOn: new Date().getTime(),
      nameOfOwners: "null",
      value: 0,
      creationYear: new Date().getFullYear()
    }
    this.assetService.showSpinner();
    this.assetService.issue(body).subscribe( data => {
      console.log('this is response,',  data);
      const res = data['status']
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', 'Asset has been issued successfully', 'success');
      this.form.value.reset;
      this.router.navigateByUrl('/issuer-dashboard');
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      this.assetService.showNotification('bottom', 'center', this.error, 'danger');
      this.form.value.reset;
    });
  }


  uploadFile(event: any) {

    const file = (event.target as HTMLInputElement).files[0];
    if ( /\.(jpe?g|gif|png|mp3|wav|mp4)$/i.test(file.name) === false  ) {
      this.assetService.showNotification('bottom', 'center', 'please select an Image, an mp3 file or mp4 file!', 'danger')
      event.srcElement.value = null;
    } else {
      this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    }

    if ( /\.(mp3|wav)$/i.test(file.name) === true  ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
      
      const mp3 = new Audio();
      mp3.src = e.target.result;
      this.mp3 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
      this.image = e.target.result;
      console.log('this is mp3', this.image)
      }

      reader.readAsDataURL(event.target.files[0]);

    }

    if ( /\.(mp4)$/i.test(file.name) === true  ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
      
      this.mp4 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
      this.image = e.target.result;
      console.log('got hereeee')
      }

      reader.readAsDataURL(event.target.files[0]);

    }

    if ( /\.(jpe?g|gif|png)$/i.test(file.name) === true  ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          const imgBase64Path = e.target.result;
          this.image = imgBase64Path;
          console.log('this is image path', imgBase64Path)
      };

      reader.readAsDataURL(event.target.files[0]);
    }
    
  }

  getUserAssets() {
    this.assetService.showSpinner();
    const userId = localStorage.getItem('userId');
    this.assetService.getAssetsByIssuerId(userId).subscribe(res => {
      console.log('these are my assets',res);
      this.assets = res['data']['items'];
      this.totalItems = res['data']['meta']['totalItems'];
      const init = [];
      const second = [];
      this.assets.forEach(element => {
        if (element.approved === 0 ) {
          init.push(element);
        } else if (element.approved === 1) {
          second.push(element);
        }
      });
      this.unapproved =  init ;
      this.approved = second;
      this.totalApproved = second.length;
      this.assetService.stopSpinner();
      console.log('this is approved', this.totalApproved)
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.stopSpinner();
      //this.assetService.showNotification('bottom', 'center', this.error, 'danger');
    });
  }

}
