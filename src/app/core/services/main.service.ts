import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl, baseHeader } from '../config/main.config.const';
import { IMenuGroups } from '../components/footer/footer.interface';
import { IPresentation, IArtwork, meta } from '../components/slider/presentation.interface';
import { navBar } from '../components/header/header.interface';
import * as headerJson from 'src/assets/data/navbar.json'
import * as footerJson from 'src/assets/data/footer.json'
import * as presentationJson from 'src/assets/data/presentation.json';
import * as artWorkJson from 'src/assets/data/artwork.json';
import * as blogJson from 'src/assets/data/blog.json';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, scan } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { IBlogGroup } from '../components/blog/blog.interfaces';


@Injectable({
  providedIn: 'root'
})
export class MainService {
  private subjectNftCard: BehaviorSubject<IArtwork []> = new BehaviorSubject<IArtwork []>(null);
  private subjectNftMeta: BehaviorSubject<meta> = new BehaviorSubject<meta>(null);
  private subjectBlogPost: BehaviorSubject<IBlogGroup> = new BehaviorSubject<IBlogGroup>(null);
  private dataStore: { artworks: IArtwork[] } = { artworks: [] }; // store our data in memory
  presentationResponse: IPresentation;
  
  constructor(public httpClient: HttpClient) {
   }

  footerResponse: IMenuGroups;
  headerResponse: navBar;


  fetchArtWorkFromMain(page: number, limit: number) {
    this.httpClient.get<IArtwork []>(`${baseUrl.mainUrl}/list-tokens?page=${page}&limit=${limit}`, baseHeader.headers).pipe(map(res => {
      res['data']['items'].forEach((item) =>   this.dataStore.artworks.push({
        id: item.id,
        category: item.category,
        tags: item.tags,
        owner: {
          id: item.id,
          image: item.media[0].media,
          username: item.owner
        },
        creator: {
          id: item.id,
          image: item.media[0].media,
          username: item.issuer,
          type: item.type
        },
        featuredImage: {
          media: item.media[0].media,
          mediaType: 0
        },
        isBidding: item.hasActiveAuction,
        gallery: item.media,
        description: item.description,
        price: 0,
        currency: item.currency,
        likes: 0,
        lastAuctionId: item.lastAuctionId,
        symbol: item.symbol,
        name: item.name,
        tokenId: item.tokenId,
        sold: item.sold,
        type: item.type
    }));
      this.subjectNftMeta.next(res['data']['meta']);
    })).subscribe(data => {

      this.subjectNftCard.next(Object.assign({}, this.dataStore).artworks);
 
    },err => {
      this.subjectNftCard.next(artWorkJson['default']);
    })
   
  }

  getMeta() {
    return this.subjectNftMeta;
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
        this.httpClient.get<IMenuGroups>(baseUrl.testUrl).subscribe((data: IMenuGroups) => {
          this.footerResponse = data; 
          observer.next(this.footerResponse);
          observer.complete();
        }, err => {
            this.footerResponse =  footerJson['default'][0]['menuGroup']
            observer.next(this.footerResponse);
            observer.complete()
        }); /* make sure to handle http error */
      }

    });
  }


  getHeader() {
    return new Observable((observer) => {
      if (this.headerResponse) {
        observer.next(this.headerResponse);
        observer.complete();
      } else { 
        this.httpClient.get<navBar>(baseUrl.testUrl).subscribe((data: navBar) => {
          this.headerResponse = data; 
          observer.next(this.headerResponse);
          observer.complete();
        }, err => {
            this.headerResponse =  headerJson['default'][0]['navLinks'];
            observer.next(this.headerResponse);
            observer.complete()
        });
      }
    });
  }

  fetchBlogPost() {
    return this.httpClient.get<IBlogGroup>(baseUrl.testUrl).subscribe((data: IBlogGroup) => {
      this.subjectBlogPost.next(data);
    }, err => {
        this.subjectBlogPost.next(blogJson['default'][0]['blogGroup']);
    }); 
  }

  getBlogPost() {
    return this.subjectBlogPost;
  }

  getPresentation(): Observable<IPresentation> {
    return new Observable((observer) => {
      if (this.presentationResponse) {
        observer.next(this.presentationResponse);
        observer.complete();

      } else { 
        this.httpClient.get<IPresentation>(baseUrl.testUrl).subscribe((data: IPresentation) => {
          this.presentationResponse = data; 
          observer.next(this.presentationResponse);
          observer.complete();
        }, err => {
            this.presentationResponse =  presentationJson['default'][0]['slides'];
            observer.next(this.presentationResponse);
            observer.complete()
        });
      }
    });
  }

 

}
