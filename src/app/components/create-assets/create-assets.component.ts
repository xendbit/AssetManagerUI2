import { Router } from '@angular/router';
import { MetamaskService } from './../../core/services/metamask.service';
import { UserActionsService } from './../../core/services/userActions.service';
import { IAssetCategory, IAssetType } from 'src/app/components/createArtwork.interface';
import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { ICreatorMedia } from '../createArtwork.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MainService } from 'src/app/core/services/main.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { timeout } from 'rxjs/operators';
import {MenuItem} from 'primeng/api';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {

  preview: any;
  previewMedia: any;
  files: File[] = [];
  media: Array<ICreatorMedia> = [];
  mediaType: string[];
  validComboDrag:any
  maxSize: number;
  categories: IAssetCategory;
  assetTypes: IAssetType;
  errorMessage: string;
  categorySelected: string = '';
  description: string;
  symbol: string;
  typeSelected: string;
  title: string;
  tokenId: number;
  account: string;
  error: string;
  displayOverlay: boolean = false;
  response: any;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  bankName: string;
  bankAddress: string;
  bankCode: string;
  bankIban: string;
  accountName: string;
  accountNumber: string;
  image: boolean;
  mp3: boolean;
  mp4: boolean;
  accountFound: boolean = false;
  previewArray: any = [];
  acceptedFileType: any = 'image/*'
  hideBrowse: boolean = false;
  fileSize: number;
  items: MenuItem[];
  activeIndex: number = 1;
  checked = false;
  currentChain: any;
  userWallet: any;

  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  constructor( public mainService: MainService,
    private spinner: NgxSpinnerService,
    public userActions: UserActionsService,
    public metamaskService: MetamaskService,
    public toast: HotToastService,
    public router: Router,
    private ngxService: NgxUiLoaderService ) {

  }

  ngOnInit(): void {
    this.ngxService.start()
    this.metamaskService.getContractAddress().subscribe(data => {
      if (data['status'] === 'success') {
        localStorage.removeItem('contractAddress');
        localStorage.setItem('contractAddress', data['data'])
      }
    })
    this.currentChain = localStorage.getItem('currentChain');
    this.mediaType = [];
    this.activeIndex = 0;
    this.items = [{
      label: 'Media & Category ',
      command: (event: any) => {
          this.activeIndex = 0;
      }
    },
    {
        label: 'Enter Description',
        command: (event: any) => {
            this.activeIndex = 1;
        }
    },
    {
        label: 'Confirm & Mint',
        command: (event: any) => {
            this.activeIndex = 2;
        }
    },
  ];

    this.checkConnection();
    if (this.categories === undefined) {
      this.mainService.getAssetCategories().subscribe((result: IAssetCategory) => {
        if (result !== undefined) {
         this.categories = result;
        }
      });
      this.mainService.getAssetTypes().subscribe((result: IAssetType) => {
       if (result !== undefined) {
         this.assetTypes = result;
        }
        this.ngxService.stop();
     })
    } else {
      this.ngxService.stop();
    }

  }


  Next() {
    if (this.activeIndex === 0 && this.categorySelected === 'musicRight'
      && this.previewMedia !== undefined && this.preview !== undefined
      || this.activeIndex === 0 && this.categorySelected === 'movieRight'
      && this.previewMedia !== undefined && this.preview !== undefined) {
        this.activeIndex = 1;
    } else if (this.activeIndex === 0 && this.categorySelected === 'musicRight'
      && this.previewMedia === undefined && this.preview !== undefined
      || this.activeIndex === 0 && this.categorySelected === 'movieRight'
      && this.previewMedia === undefined && this.preview !== undefined) {
        this.toast.error('Please select a media file for this category')
        return;
    } else if (this.previewMedia !== undefined && this.preview === undefined) {
        this.toast.error('Please select a cover art for this media');
        return;
    }  else if (this.activeIndex === 0 && this.previewMedia !== undefined && this.preview !== undefined
      && this.categorySelected === '' || this.activeIndex === 0 && this.preview !== undefined && this.categorySelected === '') {
        this.toast.error('Please select a category for this issue.');
        return;
    } else if (this.activeIndex === 0 && this.categorySelected === 'musicRight'
      && this.previewMedia !== undefined && this.preview === undefined
      || this.activeIndex === 0 && this.categorySelected === 'movieRight'
      && this.previewMedia !== undefined && this.preview === undefined) {
        this.toast.error('Please select a cover image for this media')
        return;
    } else if (this.activeIndex === 0 && this.categorySelected === 'artwork') {
      this.activeIndex = 1
    } else if (this.activeIndex === 1
      && this.categorySelected !== '' && this.description !== null
      && this.typeSelected !== undefined && this.symbol !== undefined) {
        this.activeIndex = 2
    } else if (this.activeIndex === 1
      && this.categorySelected === ''
      || this.activeIndex === 1 && this.description === null
      ||this.activeIndex === 1 && this.typeSelected === undefined
      ||this.activeIndex === 1 && this.symbol === undefined) {
        this.toast.error('Please make sure all fields are filled.')
        return;
    } else if (this.activeIndex === 2) {
      this.activeIndex = 2
    }
  }

  Back() {
    if (this.activeIndex === 2) {
      this.activeIndex = 1
    } else if (this.activeIndex === 1) {
      this.activeIndex = 0
    } else if (this.activeIndex === 0) {
      this.activeIndex = 0
    }
  }

  checkConnection() {
    this.userWallet = localStorage.getItem('userWallet');
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        this.metamaskService.checkConnection().then(res => {
          if (res === undefined || !localStorage.getItem('account')) {
            this.accountFound = false;
            this.error = 'Please Connect to your Metamask wallet account.'
            return;
          } else {
            this.accountFound = true;
            this.account = localStorage.getItem('account');
            this.checkIssuer()
          }
        })
      }
      if (this.userWallet === 'WalletConnect' && localStorage.getItem('account')) {
        this.accountFound = true;
        this.account = localStorage.getItem('account');
        this.checkIssuer()
      }
    }
  }

  register(form: NgForm) {
    this.displayOverlay = false;
    const email = form.value.email;
    const firstName = form.value.firstName;
    const middleName = form.value.middleName;
    const lastName = form.value.lastName;
    const phone = form.value.phone;
    const iban = form.value.bankIban;
    const bankCode = form.value.bankCode;
    const bankAddress = form.value.bankAddress;
    const accountName = form.value.accountName;
    const accountNumber = form.value.accountNumber;
    const bankName = form.value.bankName;
    if (email === undefined || phone === undefined  || firstName === undefined || middleName === undefined || lastName === undefined || iban === undefined ) {
      this.toast.error('Please make sure all fields are completed and correct.')
      this.displayOverlay = true;
      return false;
    }
    this.checkConnection();
    this.ngxService.start();
    this.mainService.saveIssuer(
      email, phone, firstName, lastName, middleName,
      this.account, bankName, bankAddress, accountName,
      accountNumber, bankCode, iban).subscribe(res => {
      if (res['status'] === 'success') {
        this.ngxService.stop();
        this.toast.success('Issuer has been registered successfully')
        this.checkIssuer();
      }
    }, err => {
      // console.log(err.error.data.error);
      this.error = err.error.data.error;
      this.ngxService.stop();
      this.toast.error(this.error);
      this.checkIssuer();
    })
  }

  checkIssuer() {
    this.mainService.checkIssuer(this.account).subscribe(res => {
      this.response = res;
    },
    error => {
      this.response = error['error'];
    })
  }

  switchChain(chain: string) {
    this.currentChain = chain;
    localStorage.setItem('currentChain', chain);
    window.location.reload();
  }


  check(event: any) {
    const file = event.target.files[0]
    this.errorMessage = "";
    this.fileSize = file.size/1024/1024;
    if (this.fileSize > 10) {
      this.errorMessage = "Please Make sure that the file selected is not bigger than 10MB";
      this.toast.error('Please Make sure that the file selected is not bigger than 10MB')
      return;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = this.handleFile.bind(this)
    if ( /\.(jpe?g|gif|png|mp3|mp4)$/i.test(file.name) === false  ) {
      this.errorMessage = "Please select a file type of JPEG, GIF, PNG, MP3 or MP4";
      this.toast.error('Please select a file type of JPEG, GIF, PNG, MP3 or MP4')
       return;
      } else {
        if (/\.(jpe?g|gif|png)$/i.test(file.name) === true  ) {
          this.image = true;
          this.preview = file;
          this.previewArray.push({type: 'image', name: file.name, media: file})
          this.mediaType.push('image');
        }
        if ( /\.(mp4)$/i.test(file.name) === true  ) {
          this.mp4 = true;
          this.previewMedia = file;
          this.previewArray.push({type: 'mp4', name: file.name, media: file})
          this.mediaType.push('mp4');
        }
        if ( /\.(mp3)$/i.test(file.name) === true  ) {
          this.mp3 = true;
          this.previewMedia = file;
          this.previewArray.push({type: 'mp3', name: file.name, media: file})
          this.mediaType.push('mp3');
        }
      };
      if (this.categorySelected === 'musicRight' && this.previewArray.length > 0 || this.categorySelected === 'movieRight' && this.previewArray.length > 0 ) {
        this.hideBrowse = true;
      } else {
        this.hideBrowse = false;
      }
    }
  }

  handleFile(event) {
    var binaryString = event.target.result;
    this.media.push(binaryString);
   }

  remove(index, name, type) {
    if (index !== -1) {
      this.media.splice(index, 1);
      this.mediaType.splice(index, 1)
      const compareIndex = this.previewArray.findIndex(hey => hey.name === name)
      if (index === compareIndex && type === 'image') {
        this.previewArray.splice(index, 1)
        this.preview = undefined;
      }  else if (index === compareIndex && type === 'mp3' || index === compareIndex && type === 'mp4') {
        this.previewArray.splice(index, 1)
        this.previewMedia = undefined;
      }
    }
  }

  assignPreview(asset) {
    this.preview = asset;
  }


  pickedCategory(value) {
    this.categorySelected = value;
    this.checked = true;
    if (this.categorySelected === 'musicRight' && this.previewArray.length > 0 ) {
      this.hideBrowse = true;
      this.acceptedFileType = '.mp3';
    } else if (this.categorySelected === 'movieRight' && this.previewArray.length > 0) {
      this.hideBrowse = true;
      this.acceptedFileType = '.mp4';
    } else {
      this.hideBrowse = false;
      this.acceptedFileType = 'image/*';
    }
  }

  getAssetType(value) {
    this.typeSelected = value;
  }

  async mint(form: NgForm) {
    if (this.response === undefined) {
      this.toast.error('Please confirm that your wallet address is connected.');
      this.checkConnection();
      return;
    }
    // if (this.response.data.error === 'Issuer with blockchain address not found') {
    //   this.displayOverlay = true;
    //   return;
    // }
    console.log('media', this.media)
    const imageIndex = this.media.findIndex((res: any) => res.includes('image'));
    const mediaIndex = this.media.findIndex((res: any) => res.includes('audio') || res.includes('video'))
    const newArr = [...this.media];
    var tmpOrder = this.media[imageIndex];
    this.media.splice(imageIndex, 1);
    this.media.splice(0, 0, tmpOrder);
    if (this.categorySelected === 'artwork' || this.categorySelected === 'movieRight' || this.categorySelected === 'musicRight' || this.categorySelected === 'book' ) {
     } else {
       this.toast.error('Please make sure you select a category.')
      return;
    }
    if (this.title === null || this.symbol === null) {
      this.toast.error('Please fill all fields before submission.')
      return;
    }
    var rndNo:number = Math.round((Math.random() * 1000000)) + 1;
    this.tokenId = rndNo;
    let dateCreated = new Date().getTime();
    let medias = this.media;
    if (this.mp3 === true && this.image !== true || this.mp4 === true && this.image !== true) {
      this.toast.error('Please make sure to upload an image representing the asset you intend to issue along-side the asset.')
      return;
    }
    if (this.categorySelected === 'artwork' && !this.mediaType.find(elem => elem === 'image' )) {
      this.toast.error('Please make sure to upload an image representing the asset you intend to issue along-side the asset.')
      return;
    } else if (this.categorySelected === 'movieRight' && !this.mediaType.find(elem => elem === 'mp4' )) {
      this.toast.error('Please make sure to upload an image representing the asset you intend to issue along-side the asset.')
      return;
    } else if (this.categorySelected === 'musicRight' && !this.mediaType.find(elem => elem === 'mp3' )) {
      this.toast.error('Please make sure to upload an image representing the asset you intend to issue along-side the asset.')
      return;
    } else if (this.typeSelected === undefined) {
      this.toast.error('Please make sure you select a type.')
      return;
    }else {
      this.checkConnection();
      this.ngxService.start();
      await this.metamaskService.issue(this.tokenId, this.title, this.symbol, this.account).then( data => {
        console.log('res', data)
        if (data.status === 'success') {
          setTimeout(() => {
            this.mainService.issueToken(this.tokenId, medias, this.mediaType, dateCreated, this.categorySelected, this.description, this.typeSelected).pipe(timeout(20000)).subscribe(data => {
              if (data['status'] === 'success') {
                this.ngxService.stop();
                this.toast.success('Asset has been issued successfully.')
                // this.ngOnInit();
                this.router.navigateByUrl('/profile').then(() => {
                  window.location.reload();
                });
              } else {
                this.ngxService.stop();
                this.toast.error('Minting failed, please try again.')
              }
            }, err => {
              this.ngxService.stop();
              this.toast.error('Minting failed, please try again.')
            })
            form.value.reset;
        }, 15000);
        } else {
          this.ngxService.stop();
          this.toast.error('There has been an error while trying to issue this asset, please try again.')
        }
      }, err => {
        this.error = err;
        this.ngxService.stop();
        this.toast.error(this.error)
        form.value.reset;
      });
    }
  }


}
