import { Component, OnInit, Input, OnChanges, NgZone,  SimpleChanges, ChangeDetectorRef  } from '@angular/core';
import { map, tap } from 'rxjs/operators';
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
  isLoaded: boolean = true;
  newArtworkArray: any = [];
  // isLoaded: boolean;
  // another: any [] = [];
  // result: any;
  // testTheory: any;

  constructor(public mainService: MainService, public auctionService: AuctionService, public httpClient: HttpClient,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.isLoaded = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.isLoaded = false;
    if (changes['artworkArray'] && this.artworkArray !== null) {
      if (this.artworkArray !== null) {
        console.log('oooo', this.artworkArray);
        
        // this.isLoaded = true;
        this.newArtworkArray = this.artworkArray;
        this.newArtworkArray.sort((a, b) => (a.dateIssued > b.dateIssued ? -1 : 1));
        this.artworks = this.newArtworkArray;
        this.spinner.hide();
        this.categories = this.artworkArray.map(item => item.category)
        .filter((value, index, self) => self.indexOf(value) === index);
      
        
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
    this.artworks = this.newArtworkArray.filter(item => {
      return item.category === category;
    });
  }

  
  

  byId(index, item) {
    return item.id;
  }


  loadMore(page, count) {
    this.isLoaded = false;
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchArtWorkFromMain(this.currentPage, this.itemCount);
    this.isLoaded = true;
  }

}
