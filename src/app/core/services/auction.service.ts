import { MainService } from './main.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  IArtwork,  IAuction } from '../components/slider/presentation.interface';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment, networkChains, cryptocompareInfo, niftyKey } from 'src/environments/environment';

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
      if (environment.production) {
        networkChain === 56 //defaults to harmony
      } else {
        networkChain === 97 //defaults to harmony
      }
    }
    this.foundNetwork = (networkChains.find((res: any) => res.chain === networkChain)|| 'BNB')
  }




  fetchAuctionFromMain(tokenId: number, auctionId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return new Observable((observer) => {
      this.mainService.fetchSingleArtwork(tokenId).subscribe((response: IArtwork) => {
        let artwork = response
        this.httpClient.get<IAuction []>(`${environment.baseApiUrl}get-auction-info/${tokenId}/${auctionId}`, {headers}).subscribe(data => {
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
            "chain": item.chain,
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
    return this.httpClient.post(`${environment.baseApiUrl}start-auction`,
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
    return this.httpClient.post(`${environment.baseApiUrl}change-token-ownership/${tokenId}`, {}, {headers})
  }

  checkIssuer(issuerAddress) {
    let issuer = issuerAddress.toLowerCase();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.get(`${environment.baseApiUrl}is-issuer/${issuer}`, {headers})
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
    return this.httpClient.post(`${environment.baseApiUrl}${tokenId}/toggle-sold`, {}, {headers})
  }

}
