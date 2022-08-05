import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMenuGroups } from '../components/footer/footer.interface';
import { IPresentation, IArtwork, meta, IAuction } from '../components/slider/presentation.interface';
import { INavButton } from '../components/header/header.interface';
import * as headerJson from 'src/assets/data/navbar.json'
import * as footerJson from 'src/assets/data/footer.json'
import * as presentationJson from 'src/assets/data/presentation.json';
import * as artWorkJson from 'src/assets/data/artwork.json';
import * as blogJson from 'src/assets/data/blog.json';
import * as navButtons from 'src/assets/data/navButtons.json';
import * as userJson from 'src/assets/data/user.json';
import * as creatorJson from 'src/assets/data/creators.json';
import * as categoryJson from 'src/assets/data/categories.json';
import * as assetTypeJson from 'src/assets/data/assetTypes.json';
import * as landingJson from 'src/assets/data/landing.json';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { IBlogGroup } from '../components/blog/blog.interfaces';
import { IUser } from 'src/app/pages/user-dashboard/user.interface';
import { IAssetCategory, IAssetType } from 'src/app/components/createArtwork.interface';
import { ILandingData } from 'src/app/pages/landing/landing.interface';
import { environment, niftyKey } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MainService {
  private subjectNftCard: BehaviorSubject<IArtwork []> = new BehaviorSubject<IArtwork []>(null);
  private subjectSingleArtwork: BehaviorSubject<IArtwork> = new BehaviorSubject<IArtwork>(null);
  private subjectNftMeta: BehaviorSubject<meta> = new BehaviorSubject<meta>(null);
  private subjectOwnerNftMeta: BehaviorSubject<meta> = new BehaviorSubject<meta>(null);
  private subjectOwnerNFT = new BehaviorSubject<IArtwork []>(null);
  private subjectBlogPost: BehaviorSubject<IBlogGroup> = new BehaviorSubject<IBlogGroup>(null);
  private dataStore: { artworks: IArtwork[] } = { artworks: [] }; // store our data in memory
  private ownerDataStore: { ownerArtworks: IArtwork[] } = { ownerArtworks: [] }; // store our data in memory
  presentationResponse: IPresentation;
  dropsResponse: IPresentation;
  buttonsResponse: INavButton;
  userResponse: IUser;
  creatorResponse: IUser;
  footerResponse: IMenuGroups;
  headerResponse: IMenuGroups;
  categoriesResponse: IAssetCategory;
  assetTypeResponse: any;
  landingResponse: ILandingData;
  chain: string;

  constructor(public httpClient: HttpClient) {
    if (!localStorage.getItem('currentChain') || localStorage.getItem('currentChain') === undefined || localStorage.getItem('currentChain') === null) {
      this.chain = 'bsc';
    } else {
      this.chain = localStorage.getItem('currentChain');
    }
   }


  fetchArtWorkFromMain(page: number, limit: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    this.httpClient.get<IArtwork []>(`${environment.baseApiUrl}list-tokens?page=${page}&limit=${limit}`, {headers}).pipe(map(res => {
      res['data']['items'].forEach((item) => {
        this.dataStore.artworks.push({
          id: item.id,
          category: item.category,
          tags: item.tags,
          auctions: item.auctions,
          owner: {
            id: item.id,
            image: item.media[0]?.media || './assets/img/nifty_profile.png',
            username: item.owner
          },
          creator: {
            id: item.id,
            image: item.media[0]?.media || './assets/img/nifty_profile.png',
            username: item.issuer,
            type: item.type
          },
          featuredImage: {
            media: item.media[0]?.media || './assets/img/nifty_profile.png',
            mediaType: 0
          },
          chain: item.chain,
          isBidding: item.hasActiveAuction,
          gallery: item.media,
          description: item.description,
          price: 0,
          currency: item.currency,
          likes: item.likes,
          hasActiveAuction: item.hasActiveAuction,
          isApproved: item.isApproved,
          isInAuction: item.isInAuction,
          isInSale: item.isInSale,
          lastAuctionId: item.lastAuctionId,
          symbol: item.symbol,
          name: item.name,
          tokenId: parseInt(item.tokenId),
          dateIssued: item.dateIssued,
          sold: item.sold,
          assetType: item.assetType,
          type: item.type
        })
     });
      this.subjectNftMeta.next(res['data']['meta']);
    })).subscribe(data => {

      this.subjectNftCard.next(Object.assign({}, this.dataStore).artworks);

    },err => {
      this.subjectNftCard.next(artWorkJson['default']);
    })

  }

  fetchSingleArtwork(tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return new Observable((observer) => {/* make http request & process */
      this.httpClient.get<IArtwork>(`${environment.baseApiUrl}get-token-info/${tokenId}`, {headers}).subscribe(data => {
          let item = data['data'];
          observer.next({
            id: item.id,
            category: item.category,
            tags: item.tags,
            auctions: item.auctions,
            assetType: item.assetType,
            owner: {
              id: item.id,
              image: item.media[1].media || './assets/img/nifty_profile.png',
              username: item.owner
            },
            creator: {
              id: item.id,
              image: item.media[1].media || './assets/img/nifty_profile.png',
              username: item.issuer,
              type: item.type
            },
            featuredImage: {
              media: item.media[1].media || './assets/img/nifty_profile.png',
              mediaType: 0
            },
            isBidding: item.hasActiveAuction,
            gallery: item.media,
            description: item.description,
            price: 0,
            currency: item.currency,
            likes: item.likes || [],
            chain: item.chain,
            hasActiveAuction: item.hasActiveAuction,
            isApproved: item.isApproved,
            isInAuction: item.isInAuction,
            isInSale: item.isInSale,
            lastAuctionId: item.lastAuctionId,
            symbol: item.symbol,
            name: item.name,
            tokenId: parseInt(item.tokenId),
            dateIssued: item.dateIssued,
            sold: item.sold,
            type: item.type
        });
          observer.complete();
        }, err => {
          if (err?.error.data.statusCode === 404) {
            observer.next(err.error.data);
            observer.complete()
          } else {
            observer.next(artWorkJson['default'][0]);
            observer.complete()
          }
        }); /* make sure to handle http error */
    });
  }

  fetchOnlyApproved(page: number, limit: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    this.httpClient.get<IArtwork []>(`${environment.baseApiUrl}list-tokens-with-auctions?page=${page}&limit=${limit}`, {headers}).pipe(map(res => {
      res['data']['items'].forEach((item) => {
        this.dataStore.artworks.push({
          id: item.id,
          category: item.category,
          auctions: item.auctions[0],
          tags: item.tags,
          owner: {
            id: item.id,
            image: item.ownerPhoto?.displayImage || item.media[1]?.media || './assets/img/nifty_profile.png',
            username: item.owner
          },
          creator: {
            id: item.id,
            image: item.issuerPhoto?.displayImage || item.media[1]?.media || './assets/img/nifty_profile.png',
            username: item.issuer,
            type: item.type
          },
          featuredImage: {
            media: item.media[1]?.media || './assets/img/nifty_profile.png',
            mediaType: 0
          },
          chain: item.chain,
          isBidding: item.hasActiveAuction,
          gallery: item.media,
          description: item.description,
          price: 0,
          currency: item.currency,
          likes: item.likes,
          hasActiveAuction: item.hasActiveAuction,
          isApproved: item.isApproved,
          isInAuction: item.isInAuction,
          isInSale: item.isInSale,
          lastAuctionId: item.lastAuctionId,
          symbol: item.symbol,
          name: item.name,
          tokenId: parseInt(item.tokenId),
          dateIssued: new Date(parseInt(item.dateIssued)),
          sold: item.sold,
          assetType: item.assetType,
          type: item.type
        })
     });
      this.subjectNftMeta.next(res['data']['meta']);
    })).subscribe(data => {

      this.subjectNftCard.next(Object.assign({}, this.dataStore).artworks);

    },err => {
      this.subjectNftCard.next(artWorkJson['default']);
    })
  }

  fetchAssetsByOwnerId(account: string, page, limit) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.get(`${environment.baseApiUrl}list-tokens/by-owner/${account}?page=${page}&limit=${limit}`, {headers}).pipe(map(res => {
      res['data']['items'].forEach((item) => this.ownerDataStore.ownerArtworks.push({
        id: item.id,
        category: item.category,
        tags: item.tags,
        auctions: item.auctions,
        owner: {
          id: item.id,
          image: item.media[0].media || './assets/img/nifty_profile.png',
          username: item.owner
        },
        creator: {
          id: item.id,
          image: item.media[0].media || './assets/img/nifty_profile.png',
          username: item.issuer,
          type: item.type
        },
        featuredImage: {
          media: item.media[0].media || './assets/img/nifty_profile.png',
          mediaType: 0
        },
        isBidding: item.hasActiveAuction,
        gallery: item.media,
        description: item.description,
        price: 0,
        chain: item.chain,
        currency: item.currency,
        likes: item.likes || [],
        hasActiveAuction: item.hasActiveAuction,
        isApproved: item.isApproved,
        isInAuction: item.isInAuction,
        isInSale: item.isInSale,
        lastAuctionId: item.lastAuctionId,
        symbol: item.symbol,
        name: item.name,
        tokenId: parseInt(item.tokenId),
        dateIssued: new Date(parseInt(item.dateIssued)*1000),
        sold: item.sold,
        assetType: item.assetType,
        type: item.type
    }
    ));
      this.subjectOwnerNftMeta.next(res['data']['meta']);
      // this.subjectOwnerNFT.next(Object.assign({}, this.ownerDataStore).ownerArtworks);
    })).subscribe(data => {

      this.subjectOwnerNFT.next(Object.assign({}, this.ownerDataStore).ownerArtworks);

    },err => {
      console.log('err', err)
      this.subjectOwnerNFT.next(artWorkJson['default']);
    })

  }

  getOwnerAssets() {
     return this.subjectOwnerNFT;
  }

  toggleApproved(tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.post(`${environment.baseApiUrl}${tokenId}/toggle-approved`, {}, {headers})
  }


  issueToken(tokenId: number, medias: any, mediaType: any, dateCreated: any, category: string, description: string, assetType: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.post(`${environment.baseApiUrl}issue-token/`, {
      "tokenId": tokenId,
      "medias": medias,
      "keys": mediaType,
      "dateIssued": dateCreated,
      "assetType": assetType,
      "description": description,
      "category": category
    },   {headers})
  }

  startAuctionNifty(auctionId: number, tokenId: number, startDate: number, endDate: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.post(`${environment.baseApiUrl}start-auction`,
    {tokenId: tokenId,
      auctionId: auctionId,
      startDate: startDate,
      endDate: endDate
    },   {headers})
  }


  getMeta() {
    return this.subjectNftMeta;
  }

  getOwnerMeta() {
    return this.subjectOwnerNftMeta;
  }

  returnArtwork() {
    return this.subjectNftCard;
  }

  getFooter() {
    return new Observable((observer) => {

      if (this.footerResponse) {

        observer.next(this.footerResponse);
        observer.complete();

      } else { /* make http request & process */
        this.footerResponse =  footerJson['default'][0];
        observer.next(this.footerResponse);
        observer.complete()
        // this.httpClient.get<IMenuGroups>(`${environment.baseApiUrl}footer`).subscribe((data: IMenuGroups) => {
        //   this.footerResponse = data;
        //   observer.next(this.footerResponse);
        //   observer.complete();
        // }, err => {
        //     this.footerResponse =  footerJson['default'][0];
        //     observer.next(this.footerResponse);
        //     observer.complete()
        // });
      }

    });
  }


  getHeader() {
    return new Observable((observer) => {
      if (this.headerResponse) {
        observer.next(this.headerResponse);
        observer.complete();
      } else {
        this.headerResponse =  headerJson['default'][0];
        observer.next(this.headerResponse);
        observer.complete()
      }
    });
  }

  getNavButtons() {
    return new Observable((observer) => {
      if (this.buttonsResponse) {
        observer.next(this.buttonsResponse);
        observer.complete();
      } else {
        this.buttonsResponse =  navButtons['default'][0];
        observer.next(this.buttonsResponse);
        observer.complete()
      }
    });
  }

  getUserInfo() {
    return new Observable((observer) => {
      if (this.userResponse) {
        observer.next(this.userResponse);
        observer.complete();
      } else {
        this.userResponse =  userJson['default'];
        observer.next(this.userResponse);
        observer.complete()
      }
    });
  }

  getCreators() {
    return new Observable((observer) => {
      if (this.creatorResponse) {
        observer.next(this.creatorResponse);
        observer.complete();
      } else {
        this.creatorResponse =  creatorJson['default'];
        observer.next(this.creatorResponse);
        observer.complete()
      }
    });
  }


  getAssetCategories() {
    return new Observable((observer) => {
      if (this.categoriesResponse) {
        observer.next(this.categoriesResponse);
        observer.complete();
      } else {
        this.categoriesResponse =  categoryJson['default'];
        observer.next(this.categoriesResponse);
        observer.complete()
      }
    });
  }

  getAssetTypes() {
    return new Observable((observer) => {
      if (this.assetTypeResponse) {
        observer.next(this.assetTypeResponse);
        observer.complete();
      } else {
        this.assetTypeResponse =  assetTypeJson['default'];
        observer.next(this.assetTypeResponse);
        observer.complete()
      }
    });
  }

  fetchBlogPost() {
    // return this.httpClient.get<IBlogGroup>(`${environment.baseApiUrl}get-blog`).subscribe((data: IBlogGroup) => {
    //   this.subjectBlogPost.next(data);
    // }, err => {
    //     this.subjectBlogPost.next(blogJson['default'][0]['blogGroup']);
    // });
    return this.subjectBlogPost.next(blogJson['default'][0]['blogGroup']);
  }

  submitWhitelistForm(email: string, firstname: string, lastname: string,
    amount: number, walletAddress: any, linkedInUrl: string, countryOfOrigin: string,
    linkToTweet: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${environment.icoUrl}`, {
      firstName: firstname,
      lastName: lastname,
      email: email,
      amount: amount,
      wallerAddress: walletAddress,
      linkedInUrl: linkedInUrl,
      countryOfOrigin: countryOfOrigin,
      linkToTweet: linkToTweet,
    },  {headers})
  }

  getBlogPost() {
    return this.subjectBlogPost;
  }

  getPresentation() {
    return new Observable((observer) => {
      if (this.presentationResponse) {
        observer.next(this.presentationResponse);
        observer.complete();
      } else {
        this.presentationResponse =  presentationJson['default'][0];
        observer.next(this.presentationResponse);
        observer.complete()
      }
    });
  }

  getDrops() {
    return new Observable((observer) => {
      if (this.dropsResponse) {
        observer.next(this.dropsResponse);
        observer.complete();
      } else {
        this.returnArtwork().subscribe((data: any) => {
          if (data !== null) {
            this.dropsResponse = {
              "slides": data.slice(0, 5),
              "presentationType": 1
            };
            observer.next(this.dropsResponse);
            observer.complete()
          }
        }, err => {
          this.dropsResponse =  presentationJson['default'][0];
          observer.next(this.dropsResponse);
          observer.complete()
        })
      }
    });
  }

  getLanding() {
    return new Observable((observer) => {
      if (this.landingResponse) {
        observer.next(this.landingResponse);
        observer.complete();

      } else {
        this.landingResponse =  landingJson['default'];
        observer.next(this.landingResponse);
        observer.complete()
      }
    });
  }

  saveIssuer(email: string, phone: any, firstname: string, lastname: string,
    middlename: string, blockchainAddress: any, bankName: string, bankAddress: string,
    accountName: string, accountNumber: number, bankCode: any, iban: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${environment.baseApiUrl}save-issuer/`, {
      "email": email,
      "phoneNumber": phone,
      "firstName": firstname,
      "middleName": middlename,
      "lastName": lastname,
      "blockchainAddress": blockchainAddress,
      "bankName": bankName,
      "bankAddress": bankAddress,
      "accountName": accountName,
      "accountNumber": accountNumber,
      "bankCode": bankCode,
      "iban": iban.toString()
    },  {headers})
  }

  saveBuyer(email: string, phone: any, firstname: string, lastname: string,
    middlename: string, blockchainAddress: any, country: string, zipCode: any, state: string,
    city: string, street: string, houseNumber: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.post(`${environment.baseApiUrl}save-buyer/`, {
      "email": email,
      "phoneNumber": phone,
      "firstName": firstname,
      "middleName": middlename,
      "lastName": lastname,
      "blockchainAddress": blockchainAddress,
      "country": country,
      "zipCode": zipCode,
      "state": state,
      "city": city,
      "street": street,
      "houseNumber": houseNumber
    },  {headers})
  }

  checkIssuer(issuerAddress) {

    let issuer = issuerAddress.toLowerCase();
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.get(`${environment.baseApiUrl}is-issuer/${issuer}`, {headers})
  }

  getBuyerStatus(walletAddress: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    return this.httpClient.get(`${environment.baseApiUrl}buyer/by-blockchain-address/${walletAddress}`, {headers});
  }

  getDays(t: number){
    return Math.floor(t / 86400);
  }

  getHours(t: number){
    const days = Math.floor(t / 86400);
    t -= days * 86400;
    const hours = Math.floor(t / 3600) % 24;
    return hours;
  }

  getMinutes(t: number){
      const days = Math.floor(t / 86400);
      t -= days * 86400;
      const hours = Math.floor(t / 3600) % 24;
      t -= hours * 3600;
      const minutes = Math.floor(t / 60) % 60;
      return minutes;
  }

  getSeconds(t: number){
    const days = Math.floor(t / 86400);
    t -= days * 86400;
    const hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    const minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    const seconds = t % 60;
    return seconds;
  }

  fetchArtists(artists: string, page: number, limit: number) {
    console.log('art', artists)
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.get<any[]>(`${environment.extraUrl}users/get-user-by-type/${artists}?page=${page}&limit=${limit}`, {headers});
  }

}
