import {Component, OnDestroy, OnInit} from '@angular/core';
import {IUser} from "../../../pages/user-dashboard/user.interface";
import {IArtwork} from "../../../core/components/slider/presentation.interface";
import {IFollow, ILikes} from "../../../core/components/nftcard/event.interface";
import {ICreatorMedia} from "../../../components/createArtwork.interface";
import {MainService} from "../../../core/services/main.service";
import {MetamaskService} from "../../../core/services/metamask.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {UserActionsService} from "../../../core/services/userActions.service";
import {AuctionService} from "../../../core/services/auction.service";
import {HotToastService} from "@ngneat/hot-toast";
import {NgxUiLoaderService} from "ngx-ui-loader";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

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
  walletAddress: string;

  constructor(
    public mainService: MainService,
    public metamaskService: MetamaskService,
    private clipboard: Clipboard,
    public userActions: UserActionsService,
    public auctionService: AuctionService,
    public toast: HotToastService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.walletAddress = this.route.snapshot.paramMap.get('walletAddress');
    this.mainService.loadUser(this.walletAddress, 1, 100);
    this.loadUser();
    this.getProfile();
  }


  selectView(type) {
    this.userView = type;
  }

  byId(index, item) {
    return item.id;
  }


  getMeta() {
    this.mainService.getUserMeta().subscribe(res => {
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
    this.mainService.loadUser( this.walletAddress, this.currentPage, this.itemCount);
    this.getMeta();
  }

  getProfile() {
    this.ngxService.start();
    this.userActions.getUserProfile( this.walletAddress).subscribe( (res: any) => {
      this.user = res;
      if (res.username === 'My-Profile') {
        this.user.username = 'Unknown';
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


  follow(username) {
    this.userActions.BroadcastFollowEvent("follow", 1, username,  this.walletAddress).subscribe((res: any) => {
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

  loadUser() {
    this.mainService.getUserAssets().subscribe((res: any) => {
      this.artworks = res;
    })
  }

}
