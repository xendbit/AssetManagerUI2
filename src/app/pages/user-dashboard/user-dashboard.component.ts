import { Component, OnInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { MainService } from 'src/app/core/services/main.service';
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

  constructor(public mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.getUserInfo().subscribe((data: IUser) => {
      this.user = data;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
   
   
  }

}
