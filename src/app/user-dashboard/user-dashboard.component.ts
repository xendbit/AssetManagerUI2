import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AssetsService } from '../services/assets.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

declare var PaystackPop: any;
declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  assets: any;
  orderStrategy: any;
  assetChosen: any;
  amount: any;
  price: any;
  error: any;
  email: any;
  lastName: any;
  primaryMarket: any;
  secondaryMarket: any[];
  accountNumber: string;
  fullName: string;
  firstName: string;
  middleName: string;
  userId: string;
  balance: any;
  totalSellOrders: any;
  totalOrders: any;
  totalBuyOrders: any;
  description: any;
  symbol: any;
  issuingPrice: any;
  image: any;
  title: any;
  artist: any;
  form: FormGroup;
  totalItems: any;
  unapproved: any[];
  approved: any[];
  totalApproved: number;
  startDate: any;
  endDate: any;

  constructor(public assetService: AssetsService, public router: Router, public fb: FormBuilder) {
    this.form = fb.group({
      'description': this.description,
      'symbol': this.symbol,
      'issuingPrice': this.issuingPrice,
      'image': this.image,
      'artTitle': this.title,
      'artistName': this.artist,
      'startDate': this.startDate,
      'endDate': this.endDate
  });
   }

  ngOnInit() {
    //this.hideArtDetails('hidden');
    this.image = '/assets/img/nse.png';
    this.totalBuyOrders = 0;
    this.totalSellOrders = 0;
    this.totalOrders = 0;
    this.balance = 0;
    // this.accountNumber = localStorage.getItem('accountNumber');
    // this.fullName = localStorage.getItem('firstName') + '' + localStorage.getItem('middleName');
    this.getAssets();
    this.getBalance();
    this.getBuyOrders();
    this.getSellOrders();
    // const paymentForm = document.getElementById('paymentForm');
    // paymentForm.addEventListener("submit", this.payWithPaystack, true);
  }

  getAssets() {
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          init.push(element);
        } else if (element.market === 1 && element.approved === 1) {
          second.push(element);
        }
      });
      this.primaryMarket =  init ;
      this.secondaryMarket = second;
      console.log('this is primary market', this.primaryMarket)
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => {
      this.assetService.stopSpinner();
     }
    );
  }

 
//   payWithPaystack() {
//   if (this.amount === undefined || this.email === undefined || this.firstName === undefined || this.lastName === undefined) {
//     this.assetService.showNotification('top','center', 'Please make sure all fields are filled', 'danger');
//     return;
//   }
//   this.assetService.showSpinner();
//   let handler = PaystackPop.setup({
//     key: 'pk_test_c08cca4a7676c651d37a37fa719536eb31d9db7f', // Replace with your public key
//     email: this.email,
//     amount: this.amount * 100,
//     ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
//     // label: "Optional string that replaces customer email"
//     // onClose: function(){
//     //   alert('Window closed.');
//     // },
//     callback: function(response){
//       let message = 'Payment complete! Reference: ' + response.reference;
//       alert(message);
//     }
//   });
//   this.assetService.stopSpinner();
//   handler.openIframe();
// }



  getBuyOrders() {
      this.assetService.ordersByBuyer(this.userId).subscribe(data => {
          console.log('this is orders', data['data']['meta']['totalItems'])
          this.totalBuyOrders = data['data']['meta']['totalItems'];
          if (this.totalBuyOrders === null || this.totalBuyOrders === undefined ) {
            this.totalBuyOrders = 0;
          }
      },
      err => {
          console.log(err);
          this.assetService.stopSpinner();
      },
      () => { }
      );
  }

  getSellOrders() {
      this.assetService.ordersBySeller(this.userId).subscribe(sell => {
        console.log('this is data', sell['data']['meta']['totalItems']);
        this.totalSellOrders = sell['data']['meta']['totalItems'];
        if (this.totalSellOrders === null || this.totalSellOrders === undefined) {
          this.totalSellOrders = 0;
        }
        this.totalOrders = this.totalBuyOrders + this.totalSellOrders;
        },
        err => {
            console.log(err);
            this.assetService.stopSpinner();
        },
        () => {
          this.assetService.stopSpinner();
         }
        );
  }


  getBalance() {
    this.assetService.showSpinner();
    this.userId = localStorage.getItem('userId');
    this.assetService.getWaletBalance(this.userId).subscribe(res => {
      console.log('this is balance', res);
      this.balance = res['data'];
    }, err => {
      console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.assetService.showNotification('bottom', 'center', this.error, 'danger')
    });
  }

  submit() {
    console.log('this is start date', this.form.get('startDate').value);
    this.description = this.form.get('description').value;
    this.symbol = this.form.get('symbol').value;
    this.issuingPrice = parseInt(this.form.get('issuingPrice').value);
    this.artist = this.form.get('artistName').value;
    this.title = this.form.get('artTitle').value;
    
    if (this.title === null || this.artist === null || this.symbol === null || this.description === null) {
      this.assetService.showNotification('bottom','center','Please fill all fields before submission.', 'danger');
      return;
    }

    const issueId = localStorage.getItem('userId');
    console.log('this is issueId', issueId)
    const body = {
      description: this.description,
      symbol: this.symbol,
      issuingPrice: this.issuingPrice,
      issuerId: issueId,
      artistName: this.artist,
      titleOfWork: this.title,
      image: this.image,
      commission: 500,
      price: this.issuingPrice,
      createdOn: new Date().getTime(),
      nameOfOwners: "null"
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
    if ( /\.(jpe?g|gif|png)$/i.test(file.name) === false  ) {
      this.assetService.showNotification('bottom', 'center', 'please choose an Image!', 'danger')
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
