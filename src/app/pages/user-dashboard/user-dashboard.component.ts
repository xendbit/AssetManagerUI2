import { Component, OnInit } from '@angular/core';
import {HotToastService} from '@ngneat/hot-toast';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import {fileURLToPath} from 'url';
import {ICreatorMedia} from '../../components/createArtwork.interface';
import { IUser } from './user.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import { IFollow, ILikes } from 'src/app/core/components/nftcard/event.interface';
import { UserActionsService } from 'src/app/core/services/userActions.service';
import { AuctionService } from 'src/app/core/services/auction.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  user: IUser = {
    "userId": 0,
    "username": "",
    "walletAddress": "",
    "email": "",
    "socials": {},
    "followers": [],
    "following": [],
    "likes": [],
    "createdArtworks": [],
    "collections": [],
    "bids": [],
    "isActive": true,
    "about": "",
    "displayImage": "",
    "coverImage": "",
    "webUrl": {"url": "", "title": ""},
    "joinDate": "",
    "type": ""
  };
  userView: string; account: string; artworks: IArtwork[] = []; categories: string[];
  currentPage: any; itemCount: number; itemsPerPage: number; totalItems: number;
  totalPages: number;   likes: ILikes = { tokenId: 0, likeCount: 0}; followInfo: IFollow = { id: "", followCount: 0}
  displayImage: string = "/assets/img/user-profile-default-image.png";
  coverImage: string = "/assets/img/profile_holder.jpg";
  another: any [] = [];
  error: string;
  showProfileUpload = false;
  displayPicture;
  previewMedia: any;
  facebook: string;
  twitter: string;
  private errorMessage: string;
  private image: boolean;
  private previewArray:any = [];
  public preview: any;
  private mediaType: any;
  private fileSize: number;
  private media: Array<ICreatorMedia> = [];
  selectedFile: File;
  showAboutMeModal = false;
  showSocialsModal = false;
  constructor(public mainService: MainService, public metamaskService: MetamaskService,
    private clipboard: Clipboard, public userActions: UserActionsService, public auctionService: AuctionService,
              public toast: HotToastService, private ngxService: NgxUiLoaderService) {}
  userWallet: any;

  // constructor(public mainService: MainService,
  //   public metamaskService: MetamaskService,
  //   private clipboard: Clipboard,
  //   public userActions: UserActionsService,
  //   public auctionService: AuctionService,
  //   private ngxService: NgxUiLoaderService) {
  //   }

  ngOnInit(): void {
    this.ngxService.start();
    this.account = localStorage.getItem('account');
    this.getProfile();
    this.checkConnection();
  }

  checkConnection() {
    this.ngxService.start();
    this.userWallet = localStorage.getItem('userWallet');
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        this.metamaskService.checkConnection().then(res => {
          if (res === undefined || !localStorage.getItem('account')) {
            this.error = 'Please Connect to your Metamask wallet account.';
            this.ngxService.stop();
            return;
          } else {
            this.account = localStorage.getItem('account');
            this.mainService.fetchAssetsByOwnerId(this.account, 1, 16);
            this.getMeta();
            this.mainService.getOwnerAssets().subscribe((res: IArtwork []) => {
              if (res !== null) {
                const expected = new Set();
                this.artworks = res.filter(item => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : false);
                console.log('art', this.artworks)
                this.categories = this.artworks.map(item => item.category)
                .filter((value, index, self) => self.indexOf(value) === index);
                this.ngxService.stop();
              } else {
                this.ngxService.stop();
              }
            }, err => {
              this.ngxService.stop();
            })
          }
        })
      }
      if (this.userWallet === 'WalletConnect' && localStorage.getItem('account')) {
        this.account = localStorage.getItem('account');
        this.getMeta();
        this.mainService.getOwnerAssets().subscribe((res: IArtwork []) => {
          if (res !== null) {
            const expected = new Set();
            this.artworks = res.filter(item => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : false);;
            this.categories = this.artworks.map(item => item.category)
            .filter((value, index, self) => self.indexOf(value) === index);
            this.ngxService.stop();
          } else {
            this.ngxService.stop();
          }
        }, err => {
          this.ngxService.stop();
        })
      }
    }
  }



  selectView(type) {
    this.userView = type;
  }

  byId(index, item) {
    return item.id;
  }

  getMeta() {
    this.mainService.getOwnerMeta().subscribe(res => {
      if (res !== null) {
        this.currentPage = res.currentPage;
        this.itemCount = res.itemCount;
        this.itemsPerPage = res.itemsPerPage
        this.totalItems = res.totalItems
        this.totalPages = res.totalPages
      }
    }, err => {
      this.ngxService.stop();
    })
  }

  categoryFilter(category) {
    this.artworks = this.artworks.filter(item => {
      return item.category === category;
    });
  }

  loadMore(page?, count?) {
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchAssetsByOwnerId(this.account, this.currentPage, this.itemCount);
    this.getMeta();
  }

  updateProfile() {
    this.ngxService.start();
    let userData = {
      "firstName": this.user.firstName,
      "lastName": this.user.lastName,
      "userName": this.user.username,
      "password": "password",
      "email": this.user.email,
      "walletAddress": this.account,
      "about": this.user.about,
      "webUrl": this.user.webUrl,
      "social": this.user.socials
    }
    this.userActions.updateProfile(userData, this.account).subscribe((res: any) => {
      console.log('i am here', res)
    }, err => {
      this.ngxService.stop();
    })
  }

  getProfile() {
    this.ngxService.start();
    this.userActions.getProfile(this.account).subscribe((res: any) => {
      this.user = res;
      this.displayImage = this.user.displayImage;
      this.coverImage = this.user.coverImage;
      console.log('hey', res)
    }, err => {
      console.log('err =>', err)
    })
  }


  follow(username) {
    this.updateProfile();
    this.userActions.BroadcastFollowEvent("follow", 1, username);
    this.getFollowerCount(username);
  }

  getFollowerCount(username) {
    this.followInfo.followCount = this.userActions.getFollowCount(username);
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.userActions.addSingle('global','success', 'Copied', 'Copied to clipboard!');
  }

  uploadPicture() {
    this.mainService.postDisplayPicture(this.selectedFile)
      // .subscribe(response => {
      //   console.log(response);
      // });
    this.showProfileUpload = false;
  }

  clickedProfile() {
    this.showProfileUpload = true;
  }

  check(event: any) {
    const file = event.target.files[0]
    this.selectedFile = file;
    this.errorMessage = '';
    this.fileSize = file.size / 1024 / 1024;
    if (this.fileSize > 10) {
      this.errorMessage = 'Please Make sure that the file selected is not bigger than 10MB';
      this.toast.error('Please Make sure that the file selected is not bigger than 10MB')
      return;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = this.handleFile.bind(this)
      if ( /\.(jpe?g|gif|png)$/i.test(file.name) === false  ) {
        this.errorMessage = 'Please select a file type of JPEG, GIF, PNG';
        this.toast.error('Please select a file type of JPEG, GIF, PNG')
        return;
      } else {
        if (/\.(jpe?g|gif|png)$/i.test(file.name) === true  ) {
          this.image = true;
          this.preview = file;
          reader.onload = (event: any) => {
            this.displayImage = event.target.result;
            console.log(this.displayImage);
          }
        }
      };
    }
  }

  handleFile(event) {
    const binaryString = event.target.result;
    this.media.push(binaryString);
  }

  editAboutMe() {
    this.showAboutMeModal = true;
  }

  clickedSocials() {
    this.showSocialsModal = true;
  }
  goToDetails(artwork: any) {
    localStorage.setItem('artworkData', JSON.stringify(artwork));
  }

}
