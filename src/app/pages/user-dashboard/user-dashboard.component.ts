import { Component, OnInit } from '@angular/core';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { IUser } from './user.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import { IFollow, ILikes } from 'src/app/core/components/nftcard/event.interface';
import { UserActionsService } from 'src/app/core/services/userActions.service';
import { AuctionService } from 'src/app/core/services/auction.service';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
    "aboutInfo": "",
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
  another: any [] = [];
  error: string;
  userWallet: any;

  constructor(public mainService: MainService,
    public metamaskService: MetamaskService,
    private clipboard: Clipboard,
    public userActions: UserActionsService,
    public auctionService: AuctionService,
    private ngxService: NgxUiLoaderService) {
    }

  ngOnInit(): void {
    this.account = localStorage.getItem('account');
    this.mainService.fetchAssetsByOwnerId(this.account, 1, 16);
    this.ngxService.start();
    this.mainService.getUserInfo().subscribe((data: IUser) => {
      this.user = data;
      this.displayImage = this.user.displayImage;
      this.coverImage = this.user.coverImage;
      this.ngxService.stop();
    }, err => {
      this.ngxService.stop()
      console.log('err', err)
    })
  }



  ngAfterViewInit() {
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
            this.getMeta();
            this.mainService.getOwnerAssets().subscribe((res: IArtwork []) => {
              if (res !== null) {
                this.artworks = res;
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
            this.artworks = res;
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


  follow(username) {
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

}
