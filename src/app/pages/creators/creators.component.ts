import { MainService } from './../../core/services/main.service';
import { IUser } from './../user-dashboard/user.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {
  creators: IUser [] = [{
    "userId": 1,
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
  "assetTotalValue": 0,
  "joinDate": "",
  "type": ""
  }];
  currentPage: any;
  constructor(public mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.getCreators().subscribe((result: IUser []) => {
      this.creators = result;
    })
  }

  byId(index, item) {
    return item.id;
  }

  loadMore() {
    this.currentPage = this.currentPage + 1;
    // this.mainService.fetchArtWorkFromMain(this.currentPage, this.itemCount);
  }

}
