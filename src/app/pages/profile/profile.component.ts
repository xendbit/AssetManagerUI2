import { Component, OnInit } from '@angular/core';
import {HotToastService} from '@ngneat/hot-toast';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import {ICreatorMedia} from '../../components/createArtwork.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import { IFollow, ILikes } from 'src/app/core/components/nftcard/event.interface';
import { UserActionsService } from 'src/app/core/services/userActions.service';
import { AuctionService } from 'src/app/core/services/auction.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { IUser } from 'src/app/pages/user-dashboard/user.interface';
var randomWords = require('random-words');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
  displayImage: string = "/assets/img/user-profile-default-image.png";
  coverImage: string = "/assets/img/profile_holder.jpg"; artworks: IArtwork[];
  facebook: string; twitter: string; telegram: string; discord: string; userWallet: any;
  pinterest: string; youtube: string; about: string; private errorMessage: string; webUrl: string = "";
  currentPage: any; itemCount: number; itemsPerPage: number; totalItems: number; account: string;
  totalPages: number;   likes: ILikes = { tokenId: 0, likeCount: 0}; followInfo: IFollow = { id: "", followCount: 0}

  constructor(public mainService: MainService,
    public metamaskService: MetamaskService,
    private clipboard: Clipboard,
    public userActions: UserActionsService,
    public auctionService: AuctionService,
    public toast: HotToastService,
    private ngxService: NgxUiLoaderService,
    private router: Router) { }

  ngOnInit(): void {
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
      this.ngxService.stop();
    }, err => {
      this.ngxService.stop();
      console.log('err =>', err)
    })
  }

  copyMessage(val){
    this.clipboard.copy(val);
    this.toast.success('Copied to clipboard!')
  }

}
