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
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  coverImage: string = "/assets/img/default-cover.png";
  another: any [] = [];
  error: string;
  showProfileUpload = false;
  displayPicture;
  previewMedia: any;
  private errorMessage: string;
  private image: boolean;
  private previewArray:any = [];
  public preview: any;
  private mediaType: any;
  private fileSize: number;
  private media: Array<ICreatorMedia> = [];

  constructor(public mainService: MainService, public metamaskService: MetamaskService,
    private clipboard: Clipboard, public userActions: UserActionsService, public auctionService: AuctionService,
              public toast: HotToastService) {
    }

  ngOnInit(): void {
    this.mainService.getUserInfo().subscribe((data: IUser) => {
      this.user = data;
      this.displayImage = this.user.displayImage;
      this.coverImage = this.user.coverImage;
    })
  }



  ngAfterViewInit() {
    this.checkConnection();
  }

  checkConnection() {
    this.metamaskService.checkConnection().then(res => {
      if (res === undefined || !localStorage.getItem('account')) {
        this.error = 'You are currently not connected to a wallet. Please Connect to your Metamask wallet account.'
        return;
      } else {
        this.account = localStorage.getItem('account');
        this.getMeta();
        this.mainService.getOwnerAssets().subscribe((res: IArtwork []) => {
          if (res !== null) {
            this.artworks = res;
            this.categories = this.artworks.map(item => item.category)
            .filter((value, index, self) => self.indexOf(value) === index);
          }
        })
      }
    })
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
    })
  }

  categoryFilter(category) {
    this.artworks = this.artworks.filter(item => {
      return item.category === category;
    });
    // this.artworks = this.artworkArray;
    // console.log('done')
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

  uploadPicture(form) {

  }

  clickedProfile() {
    this.showProfileUpload = true;
  }

  check(event: any) {
    const file = event.target.files[0]

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

}
