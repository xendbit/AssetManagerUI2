import { Component, OnInit } from '@angular/core';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { IUser } from './user.interface';

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
  userView: string;
  account: string;
  artworks: IArtwork[];
  categories: string[];
  currentPage: any;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;

  constructor(public mainService: MainService, public metamaskService: MetamaskService) { }

  ngOnInit(): void {
    this.metamaskService.openMetamask().then(result => {
      this.account = result.account;
      this.getMeta();
      this.mainService.fetchAssetsByOwnerId(this.account, 1, 10);
      // console.log('res', )
      this.mainService.getOwnerAssets().subscribe((res: IArtwork []) => {
        if (res !== null) {
          this.artworks = res;
          this.categories = this.artworks.map(item => item.category)
          .filter((value, index, self) => self.indexOf(value) === index);
        };
      })
   
    })
    this.mainService.getUserInfo().subscribe((data: IUser) => {
      this.user = data;
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

  loadMore(page, count) {
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchAssetsByOwnerId(this.account, this.currentPage, this.itemCount);
    this.getMeta();
  }

}