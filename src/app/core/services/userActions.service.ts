import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import {MessageService} from 'primeng/api';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEvents, IFollow, ILikes } from '../components/nftcard/event.interface';
import { map, switchMap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { baseUrl, niftyKey} from '../config/main.config.const';
import { IUser } from 'src/app/pages/user-dashboard/user.interface';
import * as userJson from 'src/assets/data/user.json';

@Injectable({
  providedIn: 'root'
})
export class UserActionsService {
  protected _eventsSubject = new Subject<IEvents>();
  userResponse: IUser;
  private dataStore = { likes: <ILikes>  {tokenId: 0, likeCount: 0},
                        follow: <IFollow> { followCount: 0, id: "" } };
  constructor(
    private messageService: MessageService, 
    private stripeService: StripeService, 
    public httpClient: HttpClient,
    public toast: HotToastService) { }

  BroadcastLikes(type: string, data: number, id: number) {
    let confirmLikeExists = this.dataStore.likes.tokenId === id;
    if (type === 'likes' && confirmLikeExists) {
      this._eventsSubject.complete();
      return;
    } else {
      this.dataStore.likes = {tokenId: id, likeCount: data};
      this._eventsSubject.next({ type, data, id })
    }

  }

  getLikes(tokenId) {
    let confirmLikeExists = this.dataStore.likes['likeCount'] > 0 && this.dataStore.likes.tokenId === tokenId;
    if (confirmLikeExists) {
      return this.dataStore.likes.likeCount;
    }

  }

  BroadcastFollowEvent(type: string, data: number, id: string) {
    let confirmFollow = this.dataStore.follow.id === id;
    if (type === 'follow' && confirmFollow) {
      this._eventsSubject.complete();
      return;
    } else {
      this.dataStore.follow = { followCount: data, id: id };
    }

  }

  getFollowCount(id) {
    let confirmLikeExists = this.dataStore.follow.id  === id;
    if (confirmLikeExists) {
      return this.dataStore.follow.followCount;
    }

  }

  addSingle(key: string, severity: string, summary: string, detail: string) {
    this.messageService.add({key: key, severity: severity, summary: summary, detail: detail});
  }

  updateProfile(userData: any, walletAddress: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('api-key', niftyKey);
    var userUpdate = JSON.stringify({
      "firstName": userData.firstName,
      "lastName": userData.lastName,
      "username": userData.username,
      "email": userData.email,
      "password": userData.password,
      "walletAddress": userData.walletAddress,
      "about": userData.about,
      "webUrl": userData.webUrl.url,
      "social": userData.social,
      "photo": userData.photo
    });
    return this.httpClient.put(`${baseUrl.extraUrl}users/${walletAddress}`, userUpdate, {headers});
  }

  getProfile(walletAddress: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('walletAddress', walletAddress)
    return new Observable((observer) => {
      if (this.userResponse) {
        observer.next(this.userResponse);
        observer.complete();
      } else {
        this.httpClient.get(`${baseUrl.extraUrl}users/profile`, {headers}).pipe(map((res: any) => {
          return {
            "userId": res.data.id,
            "username": res.data.username,
            "firstName": res.data.firstName,
            "lastName": res.data.lastName,
            "walletAddress": res.data.walletAddress,
            "email": res.data.email,
            "socials": res.data.social,
            "followers": [],
            "following": [],
            "likes": [],
            "createdArtworks": [],
            "collections": [],
            "bids": [],
            "isActive": res.data.isActive,
            "about": res.data.about,
            "displayImage": res.data.photo.displayImage,
            "coverImage": res.data.photo.coverImage,
            "webUrl": {"url": res.data.webUrl, "title": "website"},
            "joinDate": res.data.joinDate,
            "type": res.data.type
          }
        })).subscribe((data: any) => {
          this.userResponse = data;
          observer.next(this.userResponse);
          observer.complete();
        }, err => {
          this.userResponse =  userJson['default'];
          observer.next(this.userResponse);
          observer.complete()
        })
      }
    });
  }

 successToast(message: string) {
  this.toast.success(message, { autoClose: false, dismissible: true,
    style: {
      border: '1px solid #87ceeb',
      padding: '16px',
      color: '#198754',
  }})
 }

 infoToast(message: string) {
  this.toast.info(message, { autoClose: false, dismissible: true,
    style: {
      border: '1px solid #87ceeb',
      padding: '16px',
      color: '#EBA487',
  }})
 }

 errorToast(message: string) {
  this.toast.error(message, { autoClose: false, dismissible: true,
    style: {
      border: '1px solid #87ceeb',
      padding: '16px',
      color: '#713200',
  }})
 }

  initiateStripePay( amount: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Authorization', 'my-auth-token')
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('https://node-stripe-nifty.herokuapp.com/charge', {
      amount: amount
    }, {headers})
  }

}
