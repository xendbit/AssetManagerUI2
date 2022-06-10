import { Component, OnInit } from '@angular/core';
import {HotToastService} from '@ngneat/hot-toast';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import {ICreatorMedia} from '../../components/createArtwork.interface';
import { IUser } from './user.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import { IFollow, ILikes } from 'src/app/core/components/nftcard/event.interface';
import { UserActionsService } from 'src/app/core/services/userActions.service';
import { AuctionService } from 'src/app/core/services/auction.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
var randomWords = require('random-words');

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
  userView: string; account: string; artworks: IArtwork[]; categories: string[];
  currentPage: any; itemCount: number; itemsPerPage: number; totalItems: number;
  totalPages: number;   likes: ILikes = { tokenId: 0, likeCount: 0}; followInfo: IFollow = { id: "", followCount: 0}
  displayImage: string = "/assets/img/user-profile-default-image.png";
  coverImage: string = "/assets/img/profile_holder.jpg";
  another: any [] = []; error: string; showProfileUpload = false; showCoverUpload = false;
  previewMedia: any; facebook: string; twitter: string; telegram: string; discord: string;
  pinterest: string; youtube: string; about: string; private errorMessage: string; webUrl: string = "";
  private image: string;
  private previewArray:any = [];
  public preview: any;
  private mediaType: any;
  private fileSize: number;
  private media: Array<ICreatorMedia> = [];
  selectedFile: File;
  showAboutMeModal = false;
  showSocialsModal = false;
  userWallet: any;

  constructor(
    public mainService: MainService,
    public metamaskService: MetamaskService,
    private clipboard: Clipboard,
    public userActions: UserActionsService,
    public auctionService: AuctionService,
    public toast: HotToastService,
    private ngxService: NgxUiLoaderService,
    private router: Router) {
    }

  ngOnInit(): void {
    this.ngxService.start();
    this.account = localStorage.getItem('account');
    this.checkConnection();
    this.getProfile();
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
            this.getMeta();
            this.mainService.getOwnerAssets().subscribe((res: IArtwork []) => {
              if (res !== null) {
                const expected = new Set();
                this.artworks = res.filter(item => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : false);
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
    if (this.user.displayImage === './assets/img/nifty_profile.png') {
        this.user.displayImage = '11111111111';
    } 
    if (this.user.coverImage === './assets/img/profile_holder.jpg') {
      this.user.coverImage = '11111111111'
    }
    let userData = {
      "firstName": this.user.firstName,
      "lastName": this.user.lastName,
      "username": this.user.username,
      "password": this.user.password || "password",
      "email": this.user.email,
      "walletAddress": this.account,
      "about": this.user.about,
      "webUrl": this.user.webUrl.url,
      "social": this.user.socials,
      "photo": {
        "displayImage": this.user.displayImage,
        "coverImage": this.user.coverImage
      }
    }
    // if (!this.webUrl('https://')){
    //   return this.toast.error('Please Update your profile to include a valid Website URL.')
    // }
    this.userActions.updateProfile(userData, this.account).subscribe((res: any) => {
      if (res.status === 'success') {
        this.toast.success('Profile updated successfully');
        this.ngxService.stop();
      } else {
        this.toast.error('There was an error while updating your profile, please try again later.')
        this.ngxService.stop()
      }
    }, err => {
      this.toast.error('There was an error while updating your profile, please try again later.')
      this.ngxService.stop();
    })
  }

  getProfile() {
    this.ngxService.start();
    this.userActions.getProfile(this.account).subscribe(async (res: any) => {
      this.user = await res;
      if (res.username === 'My-Profile') {
        this.user.username = randomWords();
      }
      if (res.email === 'test@niftyrow.com') {
        this.user.email = this.user.username+'@niftyrow.com'
      }
      if (this.user.displayImage === 'imageUrl') {
        this.user.displayImage = './assets/img/nifty_profile.png';
      } 
      if (this.user.coverImage === 'imageUrl') {
        this.user.coverImage = './assets/img/profile_holder.jpg'
      }
      this.displayImage = this.user.displayImage;
      this.coverImage = this.user.coverImage;
      this.twitter = this.user.socials.twitterUrl;
      this.facebook = this.user.socials.facebookUrl;
      this.telegram = this.user.socials.telegramUrl;
      this.youtube = this.user.socials.youtubeUrl;
      this.pinterest = this.user.socials.pinterestUrl
      this.discord = this.user.socials.discordUrl;
      this.webUrl = this.user.webUrl.url;
    }, err => {
      console.log('err =>', err)
    })
  }


  follow(username) {
    this.userActions.BroadcastFollowEvent("follow", 1, username, this.account).subscribe((res: any) => {
      if (res.status === 'success') {
        this.toast.success('Successfully followed this account');
        this.getFollowerCount(username);
      }
    }, err => {
      console.log('err =>', err)
    })
  }

  getFollowerCount(username) {
    this.followInfo.followCount = this.userActions.getFollowCount(username);
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.toast.success('Copied to clipboard!')
  }

  uploadDisplayPicture() {
    this.displayImage = this.image;
    this.user.displayImage = this.displayImage;
    this.updateProfile();
    this.showProfileUpload = false;
  }

  uploadCoverPicture() {
    this.coverImage = this.image;
    this.user.coverImage = this.coverImage;
    this.updateProfile();
    this.showCoverUpload = false;
  }

  clickedDisplayImage() {
    this.showProfileUpload = true;
  }

  clickedCoverImage() {
    this.showCoverUpload = true;
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
      if ( /\.(jpe?g|gif|png)$/i.test(file.name) === false  ) {
        this.errorMessage = 'Please select a file type of JPEG, GIF, PNG';
        this.toast.error('Please select a file type of JPEG, GIF, PNG')
        return;
      } else {
        if (/\.(jpe?g|gif|png)$/i.test(file.name) === true  ) {
          this.preview = file;
          reader.onload = (event: any) => {
            this.image = event.target.result;
          }
        }
      };
    }
  }

  editAboutMe() {
    this.showAboutMeModal = true;
  }

  updateAbout() {
    this.user.about = this.about;
    this.updateProfile();
    this.showAboutMeModal = false;
  }

  updateSocials() {
    this.user.socials.twitterUrl = this.twitter;
    this.user.socials.facebookUrl = this.facebook;
    this.user.socials.telegramUrl = this.telegram;
    this.user.socials.youtubeUrl = this.youtube;
    this.user.socials.pinterestUrl = this.pinterest;
    this.user.socials.discordUrl = this.discord;
    this.updateProfile();
    this.showSocialsModal = false;
  }

  clickedSocials() {
    this.showSocialsModal = true;
  }
  goToDetails(artwork: any) {
    localStorage.setItem('artworkData', JSON.stringify(artwork));
  }

}
