import { MainService } from './main.service';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl, niftyKey, blockchainInfo} from '../config/main.config.const';
import { IMenuGroups } from '../components/footer/footer.interface';
import { IPresentation, IArtwork, meta, IAuction } from '../components/slider/presentation.interface';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, scan } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as auctionJson from 'src/assets/data/auction.json';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private subjectAuction: BehaviorSubject<IAuction> = new BehaviorSubject<IAuction>(null);
  private dataStore: { auctions: IAuction } // store our data in memory

  constructor(public httpClient: HttpClient, public mainService: MainService) {
 
  }


  

  fetchAuctionFromMain(tokenId: number, auctionId: number) {

    return new Observable((observer) => {
      this.mainService.fetchSingleArtwork(tokenId).subscribe((response: IArtwork) => {
        let artwork = response
        this.httpClient.get<IAuction []>(`${baseUrl.mainUrl}/get-auction-info/${tokenId}/${auctionId}`, baseUrl.headers).subscribe(data => {
          let item = data['data'] 
          observer.next({
            "auctionId": item.auctionId,
            "cancelled": item.cancelled,
            "currentBlock": item.currentBlock,
            "startBlock": item.startBlock,
            "endBlock": item.endBlock,
            "highestBid": item.highestBid,
            "highestBidder": item.highestBidder,
            "bids": item.bids,
            "isActive": item.isActive,
            "owner": item.owner,
            "sellNowPrice": item.sellNowPrice,
            "title": artwork.symbol,
            "currentBid": item.highestBid, //highest bid is always the current bid, if no bid has been made, it is always set to minimum bid
            "currency": "ETH",
            "endDate": item.endDate,
            "startDate": item.startDate,
            "minimumBid": item.minimumBid,
            "tokenId": parseInt(item.tokenId),
            "artwork": artwork,
            "type": "Auction"
        });
          observer.complete();
     
        },err => {
           observer.next(auctionJson['default']);
           observer.complete();
        })
      })
    });
   
  }

  startAuctionNifty(auctionId: number, tokenId: number, startDate: any, endDate: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${baseUrl.mainUrl}start-auction`, 
    {tokenId: tokenId,
      auctionId: auctionId,
      startDate: startDate,
      endDate: endDate
    },  {headers})
  }

  checkIssuer(issuerAddress) {
    let issuer = issuerAddress.toLowerCase();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.get(`${baseUrl.mainUrl}is-issuer/${issuer}`, {headers})
  }

  getETHtoUSDValue() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('X-API-Token', blockchainInfo.key);
    return this.httpClient.get(`${blockchainInfo.url}/tickers/ETH-USD`, {headers})
  }

  // fetchArtWorkFromMain(page: number, limit: number) {
  //   return new Observable((observer) => {
  //     this.httpClient.get<IArtwork []>(`${baseUrl.mainUrl}/list-tokens?page=${page}&limit=${limit}`, baseUrl.headers).pipe(map(res => {
  //       res['data']['items'].forEach((item) => {
  //         if (item.lastAuctionId !== '') {
  //           this.httpClient.get<IAuction []>(`${baseUrl.mainUrl}/get-auction-info/${item.tokenId}/${item.auctionId}`, baseUrl.headers).subscribe(data => {
  //             let auction = data['data'] 
  //             observer.next({
  //               id: item.id,
  //               category: item.category,
  //               tags: item.tags,
  //               owner: {
  //                 id: item.id,
  //                 image: item.media[0].media,
  //                 username: item.owner
  //               },
  //               creator: {
  //                 id: item.id,
  //                 image: item.media[0].media,
  //                 username: item.issuer,
  //                 type: item.type
  //               },
  //               featuredImage: {
  //                 media: item.media[0].media,
  //                 mediaType: 0
  //               },
  //               isBidding: item.hasActiveAuction,
  //               gallery: item.media,
  //               description: item.description,
  //               price: 0,
  //               currency: item.currency,
  //               likes: 0,
  //               hasActiveAuction: item.hasActiveAuction,
  //               lastAuctionId: item.lastAuctionId,
  //               symbol: item.symbol,
  //               name: item.name,
  //               tokenId: parseInt(item.tokenId),
  //               dateIssued: new Date(parseInt(item.dateIssued)*1000),
  //               sold: item.sold,
  //               assetType: item.assetType,
  //               type: item.type,
  //               auction: {
  //                 "auctionId": item.auctionId,
  //                 "cancelled": item.cancelled,
  //                 "currentBlock": item.currentBlock,
  //                 "startBlock": item.startBlock,
  //                 "endBlock": item.endBlock,
  //                 "highestBid": item.highestBid,
  //                 "highestBidder": item.highestBidder,
  //                 "bids": item.bids,
  //                 "isActive": item.isActive,
  //                 "owner": item.owner,
  //                 "sellNowPrice": item.sellNowPrice,
  //                 "title": item.symbol,
  //                 "currentBid": item.highestBid,
  //                 "currency": "ETH",
  //                 "endDate": item.endDate,
  //                 "startDate": item.startDate,
  //                 "minimumBid": item.minimumBid,
  //                 "tokenId": parseInt(item.tokenId),
  //                 "type": "Auction"
  //             }
  //           })
  //         })
  //       }
  //       }) 
  //       observer.complete();
  //     }, err => {
  //       observer.next(auctionJson['default']);
  //       observer.complete();
  //     }));
  //   })
   
  // }

}
