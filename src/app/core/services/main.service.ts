import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl, baseHeader } from '../config/main.config.const';
import { IMenuGroups } from '../interfaces/footer/footer.interface';
import { IPresentation, IArtwork } from '../interfaces/presentation/presentation.interface';
import { navBar } from '../interfaces/header/header.interface';
import * as headerJson from 'src/assets/data/navbar.json'
import * as footerJson from 'src/assets/data/footer.json'
import * as presentationJson from 'src/assets/data/presentation.json';
import * as artWorkJson from 'src/assets/data/artwork.json';
import * as blogJson from 'src/assets/data/blog.json';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { IBlogGroup } from '../interfaces/blog/blog.interfaces';


@Injectable({
  providedIn: 'root'
})
export class MainService {
  private subjectNftCard = new BehaviorSubject<IArtwork>(null);
  private subjectNftTrial = new BehaviorSubject(null);
  private subjectBlogPost = new BehaviorSubject<IBlogGroup>(null);
  presentationResponse: IPresentation;
  
  constructor(public httpClient: HttpClient) {
   }

  footerResponse: IMenuGroups;
  headerResponse: navBar;


  getArtWork() {
    this.httpClient.get<IArtwork>(baseUrl.testUrl).subscribe((data: IArtwork) => {
      this.subjectNftCard.next(data);
    }, err => {
        this.subjectNftCard.next(artWorkJson['default']);
    }); 
    return this.subjectNftCard.asObservable();
  }

  getArtWorkFromMain(page: number, limit: number) {
    this.httpClient.get(`${baseUrl.mainUrl}/list-tokens?page=${page}&limit=${limit}`, baseHeader.headers).subscribe(data => {
      this.subjectNftTrial.next(data);
    }, err => {
        this.subjectNftTrial.next(artWorkJson['default']);
    }); 
    return this.subjectNftTrial.asObservable();
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

  getBlogPost() {
    this.httpClient.get<IBlogGroup>(baseUrl.testUrl).subscribe((data: IBlogGroup) => {
      this.subjectBlogPost.next(data);
    }, err => {
        this.subjectBlogPost.next(blogJson['default'][0]['blogGroup']);
    }); 
    return this.subjectBlogPost.asObservable();
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
