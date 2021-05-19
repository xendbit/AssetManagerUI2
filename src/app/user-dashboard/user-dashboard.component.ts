import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AssetsService } from '../services/assets.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { timeout } from 'rxjs/operators';


declare var PaystackPop: any;
declare var $: any;
declare let window: any;

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
  metamask: any;
  account: any;
  hasMetaMask: boolean;
  tempImage: string;
  mp3: any;
  phone: number;
  blockchainAddress: string;
  mp4: any;
  tokenId: number;
  mediaType: any[];
  media: any[];
  imageCategories: { name: string,  value: string }[] = [
    { "name": 'Artwork',  value: "artwork" },
    { "name": 'Movie Rights',  value: "movieRight" },
    { "name": 'Music Rights',  value: "musicRight" },
    { "name": 'Books',  value: "book" }
  ];
  categorySelected: any;
  userAgent: string;
  images: any;
  @ViewChild('marketModalLong') openModal: ElementRef;
  response: any;


  constructor(public assetService: AssetsService, public router: Router, public fb: FormBuilder, private domSanitizer: DomSanitizer) {
    this.form = fb.group({
      'description': this.description,
      'symbol': this.symbol,
      'issuingPrice': this.issuingPrice,
      'image': this.image,
      'artTitle': this.title,
      'artistName': this.artist,
      'startDate': this.startDate,
      'endDate': this.endDate,
      'imageCategories': this.imageCategories
  });

    if (window.ethereum.isMetaMask === true) {
      this.metamask = window.ethereum;
      this.hasMetaMask = true;
    } else {
      this.hasMetaMask = false;
    }
   }

  async ngOnInit() {
   
    var ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.userAgent = 'mobile';
    } else if(/Chrome/i.test(ua)) {
      this.userAgent = 'chrome';
    } else {
      this.userAgent = 'desktop';
    }
    this.media = [];
    this.mediaType = [];
    
    //this.hideArtDetails('hidden');
    this.assetService.getMetamaskInfo().then( data => {
      this.balance = data.balance;
    })
    this.checkIssuer();
    
    this.tempImage = '/assets/img/nft.png';
    this.totalBuyOrders = 0;
    this.totalSellOrders = 0;
    this.totalOrders = 0;
    // this.accountNumber = localStorage.getItem('accountNumber');
    // this.fullName = localStorage.getItem('firstName') + '' + localStorage.getItem('middleName');
    this.getBuyOrders();
    this.getSellOrders();
    // const paymentForm = document.getElementById('paymentForm');
    // paymentForm.addEventListener("submit", this.payWithPaystack, true);
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


register(register: NgForm) {
  
  const email = register.value.email;
  const firstName = register.value.firstName;
  const middleName = register.value.middleName;
  const lastName = register.value.lastName;
  const phone = register.value.phone;
  const blockchainAddress = register.value.blockchainAddress;
  if (email === undefined || phone === undefined  || firstName === undefined || middleName === undefined || lastName === undefined  || blockchainAddress === undefined) {
    this.assetService.showNotification('top', 'center', "Please make sure all fields are completed and correct.", 'danger');
    return;
  }
  this.assetService.showSpinner();
  this.assetService.saveIssuer(email, phone, firstName, lastName, middleName, blockchainAddress).subscribe(res => {
    console.log('==>', res);
    if (res['status'] === 'success') {
      this.assetService.stopSpinner();
      this.assetService.showNotification('top', 'center', 'Issuer has been successfully registered', 'success');
      this.router.navigateByUrl('/login')
    }
  }, err => {
    console.log(err.error.data.error);
    this.error = err.error.data.error;
    this.assetService.stopSpinner();
    this.assetService.showNotification('top', 'center', this.error, 'danger');
  })
}



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

  getCategory(item) {
    console.log('this is event', item)
    this.categorySelected =  item;
  }

  checkIssuer() {
    this.assetService.getMetamaskInfo().then( data => {
      this.balance = data.balance;
      // this.account = data.account.toUpperCase();
      this.account = data.account;
      console.log('this is account', this.account);
      this.assetService.getIssuerStatus(this.account).subscribe(res => {
        console.log('this is response', res)
        this.response = res;
      },
      error => {
        this.response = error['error']['data']['error'];
        console.log('this is error', this.response);
      })
    })
    
  }
 
  async submit() {
    if (this.response === 'Issuer with blockchain address not found') {
        let element: HTMLElement = document.getElementById('openModal') as HTMLElement;
        console.log('this is element', element);
        element.click()
        return;
    }
    this.categorySelected =  this.form.get('imageCategories').value;
    if (this.categorySelected === 'artwork' || this.categorySelected === 'movieRight' || this.categorySelected === 'musicRight' || this.categorySelected === 'book' ) {
     } else {
      this.assetService.showNotification('bottom', 'center', 'Please make sure you select a category from the dropdown.', 'danger');
      return;
    }
    
    
    // this.description = this.form.get('description').value;
    this.symbol = this.form.get('symbol').value;
    // this.issuingPrice = parseInt(this.form.get('issuingPrice').value);
    // this.artist = this.form.get('artistName').value;
    this.title = this.form.get('artTitle').value;
    
    if (this.title === null || this.symbol === null) {
      this.assetService.showNotification('bottom','center','Please fill all fields before submission.', 'danger');
      return;
    }

    // const issueId = localStorage.getItem('userId');
    // console.log('this is issueId', issueId)

    var rndNo:number = Math.round((Math.random() * 1000000)) + 1;
    this.tokenId = rndNo;
    console.log('this is token id', this.tokenId);
  
    // const body = {
    //   tokenId: this.tokenId,
    //   medias: this.media,
    //   keys: this.mediaType
    //   // issuerId: issueId,
    //   // artistName: this.artist,
    //   // titleOfWork: this.title,
    //   // image: this.image,
    //   // commission: 500,
    //   // price: this.issuingPrice,
    //   // createdOn: new Date().getTime(),
    //   // nameOfOwners: "null"
    // }
    let dateCreated = new Date().getTime();
    let medias = this.media
    if (this.categorySelected === 'artwork' && !this.mediaType.find(elem => elem === 'image' )) {
      this.assetService.showNotification('bottom', 'center', 'Please make sure to upload an image representing the asset you intend to issue along-side the asset.', 'danger');
      return;
    } else if (this.categorySelected === 'movieRight' && !this.mediaType.find(elem => elem === 'mp4' )) {
      this.assetService.showNotification('bottom', 'center', 'Please make sure to upload a video representing the asset you intend to issue along-side the asset.', 'danger');
      return;
    } else if (this.categorySelected === 'audioRight' && !this.mediaType.find(elem => elem === 'mp3' )) {
      this.assetService.showNotification('bottom', 'center', 'Please make sure to upload an audio representing the asset you intend to issue along-side the asset.', 'danger');
      return;
    } else {
      this.assetService.showSpinner();
      await this.assetService.issue(this.tokenId, this.title, this.symbol).then( data => {
        if (data.status === 'success') {
          setTimeout(() => {
            this.assetService.issueToken(this.tokenId, medias, this.mediaType, dateCreated, this.categorySelected).pipe(timeout(20000)).subscribe(data => {
              if (data['status'] === 'success') {
                this.assetService.stopSpinner();
                this.assetService.showNotification('bottom', 'center', 'Asset has been issued successfully', 'success');
              } else {
                this.assetService.stopSpinner();
                this.assetService.showNotification('bottom', 'center', 'There has been an error while trying to issue this asset, please try again.', 'danger');
              }
            }, err => {
              this.assetService.stopSpinner();
              this.assetService.showNotification('bottom', 'center', 'There has been an error while trying to issue this asset, please try again', 'danger');
            })
      
            this.form.value.reset;
            // this.router.navigateByUrl('/issuer-dashboard');
        }, 15000);
        }
      }, err => {
        console.log(err.error.data.error);
        this.error = err.error.data.error;
        this.assetService.stopSpinner();
        this.assetService.showNotification('bottom', 'center', this.error, 'danger');
        this.form.value.reset;
      });
    }
    
  }


  uploadFile(event: any) {

   
    let files = event.target.files;
   
    for(let newFile of files) {
      const fileSize = newFile.size/1024/1024;
      if (fileSize > 10) {
      this.assetService.showNotification('top', 'center', 'You currently cannot issue an asset larger than 10MB, please select a smaller asset and try again', 'danger');
      return;
    }
    if ( /\.(jpe?g|gif|png|mp3|wav|mp4)$/i.test(newFile.name) === false  ) {
      this.assetService.showNotification('bottom', 'center', 'please select an Image, an mp3 file or mp4 file!', 'danger')
      event.srcElement.value = null;
    } else {
      this.form.patchValue({
      image: newFile
    });
    this.form.get('image').updateValueAndValidity();
    }

    if ( /\.(mp3|wav)$/i.test(newFile.name) === true  ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
      const mp3 = new Audio();
      mp3.src = e.target.result;
      this.mp3 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
      this.image = e.target.result;
      this.media.push(e.target.result);
      this.mediaType.push('mp3') ;
      }

      reader.readAsDataURL(event.target.files[0]);

    }

    if ( /\.(mp4)$/i.test(newFile.name) === true  ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
      
      this.mp4 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
      this.image = e.target.result;
      this.media.push(e.target.result)
      this.mediaType.push('mp4') ;
     
      }

      reader.readAsDataURL(event.target.files[0]);

    }

    if ( /\.(jpe?g|gif|png)$/i.test(newFile.name) === true  ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          const imgBase64Path = e.target.result;
          this.image = imgBase64Path;
          this.media.push(e.target.result)
          this.mediaType.push('image')
      };

      reader.readAsDataURL(event.target.files[0]);
    }
    };
    
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
