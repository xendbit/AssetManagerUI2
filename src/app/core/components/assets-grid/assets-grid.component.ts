import { Component, OnInit, Input, OnChanges, NgZone,  SimpleChanges, ChangeDetectorRef  } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IArtwork, IAuction } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { AuctionService } from '../../services/auction.service';
import { mergeMap } from 'rxjs/operators';
import { baseUrl } from '../../config/main.config.const';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-assets-grid',
  templateUrl: './assets-grid.component.html',
  styleUrls: ['./assets-grid.component.scss'],

})
export class AssetsGridComponent implements OnInit {
  artworks: IArtwork [];
  // auction: IAuction;
  work: any [];
  @Input() public artworkArray: IArtwork [];
  @Input() public parentPage: string;
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  categories: string[];
  // isLoaded: boolean;
  // another: any [] = [];
  // result: any;
  // testTheory: any;

  constructor(public mainService: MainService, public auctionService: AuctionService, public httpClient: HttpClient,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.isLoaded = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.isLoaded = false;
    if (changes['artworkArray'] && this.artworkArray !== null) {
      if (this.artworkArray !== null) {
        // this.isLoaded = true;
        this.artworks = this.artworkArray;
        this.spinner.hide();
        this.categories = this.artworkArray.map(item => item.category)
        .filter((value, index, self) => self.indexOf(value) === index);
        // this.testTheory = this.httpClient.get<IArtwork []>(`${baseUrl.mainUrl}/list-tokens?page=1&limit=10`, baseUrl.headers)
        // .pipe(mergeMap(character => this.httpClient.get<IAuction []>(`${baseUrl.mainUrl}/get-auction-info/${character['tokenId']}/${character['auctionId']}`, baseUrl.headers)));
        // console.log('this is ', this.testTheory)
        // this.mainService.returnArtwork().subscribe((responseFromArtwork: IArtwork []) => {
        //   const auctionReq: Array<Observable <any> > = [];
        //   responseFromArtwork.forEach(individualResponse => {
        //     auctionReq.push(this.httpClient.get<IAuction []>(`${baseUrl.mainUrl}/get-auction-info/${individualResponse['tokenId']}/${individualResponse['auctionId']}`, baseUrl.headers))
        //   })
        //   forkJoin(auctionReq).subscribe(forkjoinResults => {
        //     console.log('this is result', forkjoinResults)
        //     // results[0] is for list of artworks
        //     // results[1] is supposed to be for auction response
        //   });
        // })
        // this.artworkArray.forEach((artwork) => {
        //   this.auctionService.fetchAuctionFromMain(artwork.tokenId, artwork.lastAuctionId).subscribe(res => {
        //     console.log('here')
        //         if (res !== undefined) {
        //           this.another.push({
        //             ...artwork,
        //             auction: res
        //           })
        //         }
               
        //   })
        // })
        // console.log('here', this.another.filter(res => res.auction.bids[0]['bid'] < res.auction.sellNowPrice))
      
        // console.log('another 3', this.another)
        // this.artworks = this.artworks.map(obj => this.another.find(o => o.id === obj.id) || obj);
        // const seen = new Set();
        // const filteredArr = this.another.filter(el => {
        //   const duplicate = seen.has(el.id);
        //   seen.add(el.id);
        //   return !duplicate;
        // });
        // console.log('this =>', filteredArr)
        // this.artworks = this.another;
      }
    }

    this.mainService.getMeta().subscribe(res => {
      if (res !== null) {
        this.currentPage = res.currentPage;
        this.itemCount = res.itemCount;
        this.itemsPerPage = res.itemsPerPage
        this.totalItems = res.totalItems
        this.totalPages = res.totalPages
      }
    })
    
  }
  


  categoryFilter(category: string) {
    this.artworkArray = this.artworks.filter(item => {
      return item.category === category;
    });
  }

  
  

  byId(index, item) {
    return item.id;
  }


  loadMore(page, count) {
    this.spinner.show();
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchArtWorkFromMain(this.currentPage, this.itemCount);
    this.spinner.hide();
  }

}
