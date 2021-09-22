import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../config/main.config.const';
import { IMenuGroups, navBar, IPresentation } from '../interfaces/main.interface';
import * as headerJson from 'src/assets/data/navbar.json'
import * as footerJson from 'src/assets/data/footer.json'
import * as presentationJson from 'src/assets/data/presentation.json';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MainService {
  isYEs: BehaviorSubject<IPresentation> = new BehaviorSubject<IPresentation>(null);
  presentationResponse: IPresentation;
  
  constructor(public httpClient: HttpClient) {
   }

  footerResponse: IMenuGroups;
  headerResponse: navBar;


  getFooter() {
    return new Observable((observer) => {

      if (this.footerResponse) {

        observer.next(this.footerResponse);
        observer.complete();

      } else { /* make http request & process */
        this.httpClient.get<IMenuGroups>(baseUrl.mainUrl).subscribe((data: IMenuGroups) => {
          this.footerResponse = data; 
          observer.next(this.footerResponse);
          observer.complete();
          // return this.footerResponse;
        }, err => {
            this.footerResponse =  footerJson['default'][0]['menuGroup']
            observer.next(this.footerResponse);
            observer.complete()
            // return this.footerResponse;
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
        this.httpClient.get<navBar>(baseUrl.mainUrl).subscribe((data: navBar) => {
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

  getPresentation(): Observable<IPresentation> {
    return new Observable((observer) => {
      if (this.presentationResponse) {
        observer.next(this.presentationResponse);
        observer.complete();

      } else { 
        this.httpClient.get<IPresentation>(baseUrl.mainUrl).subscribe((data: IPresentation) => {
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
