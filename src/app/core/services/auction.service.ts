import { MainService } from './main.service';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl, niftyKey, blockchainInfo, cryptocompareInfo, networkChains} from '../config/main.config.const';
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
  chain: string;
  foundNetwork: any;

  constructor(public httpClient: HttpClient, public mainService: MainService) {
    if (!localStorage.getItem('currentChain') || localStorage.getItem('currentChain') === undefined || localStorage.getItem('currentChain') === null) {
      this.chain = 'bsc';
    } else {
      this.chain = localStorage.getItem('currentChain');
    }
    let networkChain = parseInt(localStorage.getItem('networkChain'));
    if (networkChain === undefined || networkChain === null) {
      networkChain === 97 //defaults to bsc
    }
    this.foundNetwork = networkChains.find((res: any) => res.chain === networkChain)
  }




  fetchAuctionFromMain(tokenId: number, auctionId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return new Observable((observer) => {
      this.mainService.fetchSingleArtwork(tokenId).subscribe((response: IArtwork) => {
        let artwork = response
        this.httpClient.get<IAuction []>(`${baseUrl.mainUrl}get-auction-info/${tokenId}/${auctionId}`, {headers}).subscribe(data => {
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
            observer.next(err['error']['data']['error']);
            observer.complete();
        })
      })
    });

  }

  startAuctionNifty(auctionId: number, tokenId: number, startDate: any, endDate: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.post(`${baseUrl.mainUrl}start-auction`,
    {tokenId: tokenId,
      auctionId: auctionId,
      startDate: startDate,
      endDate: endDate
    },  {headers})
  }

  changeTokenOwnership(tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.post(`${baseUrl.mainUrl}change-token-ownership/${tokenId}`, {}, {headers})
  }

  checkIssuer(issuerAddress) {
    let issuer = issuerAddress.toLowerCase();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.get(`${baseUrl.mainUrl}is-issuer/${issuer}`, {headers})
  }

  getUSDValue() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('X-API-Token', blockchainInfo.key);
    return this.httpClient.get(`${cryptocompareInfo.url}fsym=${this.foundNetwork.currency}&tsyms=USD,NGN`, {headers})
  }

  toggleSold(tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.post(`${baseUrl.mainUrl}${tokenId}/toggle-sold`, {}, {headers})
  }

}
