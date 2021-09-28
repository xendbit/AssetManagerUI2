import { MainService } from './main.service';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl} from '../config/main.config.const';
import { IMenuGroups } from '../components/footer/footer.interface';
import { IPresentation, IArtwork, meta, IAuction } from '../components/slider/presentation.interface';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, scan } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private subjectAuction: BehaviorSubject<IAuction []> = new BehaviorSubject<IAuction []>(null);
  private dataStore: { auctions: IAuction[] } = { auctions: [] }; // store our data in memory

  constructor(public httpClient: HttpClient, public mainService: MainService) {
  }


  

  fetchAuctionFromMain(tokenId: number, auctionId: number) {

    this.httpClient.get<IAuction []>(`${baseUrl.mainUrl}/get-auction-info/${tokenId}/${auctionId}`, baseUrl.headers).pipe(map(res => {
      let item = res['data'] 
      this.dataStore.auctions.push({
        "auctionId": item.auctionId,
        "cancelled": item.cancelled,
        "currentBlock": item.currentBlock,
        "startBlock": item.startBlock,
        "endBlock": item.endBlock,
        "highestBid": item.highestBid,
        "highestBidder": item.highestBidder,
        "isActive": item.isActive,
        "owner": item.owner,
        "sellNowPrice": item.sellNowPrice,
        "title": "Otown Auction",
        "currentBid": 0,
        "currency": "ETH",
        "endDate": item.endDate,
        "startDate": item.startDate,
        "minimumBid": item.minimumBid,
        "tokenId": item.tokenId,
        "artwork": {
            "id": "reno",
            "category": "artwork",
            "tags": ["art", "away"],
            "owner": {
                "id": "OGW",
                "image": "https://res.cloudinary.com/xendbit/raw/upload/v1619698206/i4ue53khqd8jhb6wniw8",
                "username": "Ndo"
            },
            "creator": {
                "id": "Rew",
                "image": "https://res.cloudinary.com/xendbit/raw/upload/v1619698206/i4ue53khqd8jhb6wniw8",
                "username": "Ndo",
                "collections": [],
                "type": "Creator"
            },
            "featuredImage": {
                "media": "https://res.cloudinary.com/xendbit/raw/upload/v1619698206/i4ue53khqd8jhb6wniw8",
                "mediaType": 0
            },
            "isBidding": true,
            "gallery": [{
                "media": "https://res.cloudinary.com/xendbit/raw/upload/v1619698206/i4ue53khqd8jhb6wniw8",
                "mediaType": 0
            }],
            "description": "Description",
            "price": 23,
            "currency": "ETH",
            "likes": 34,
            "lastAuctionId": 12345,
            "symbol": "",
            "name": "",
            "type": "Artwork",
            "tokenId": "",
            "dateIssued": "",
            "sold": true
        },
        "type": "Auction"
    });
    })).subscribe(data => {

      this.subjectAuction.next(Object.assign({}, this.dataStore).auctions);
 
    },err => {
      // this.subjectNftCard.next(artWorkJson['default']);
    })
   
  }


}
