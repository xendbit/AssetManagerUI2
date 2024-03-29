import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { IArtwork } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { AuctionService } from '../../services/auction.service';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  @Input() public pageTitle: string;
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  categories: any = [];
  isLoaded: boolean = true;
  newArtworkArray: any = [];
  categorySelected: string;
  @HostListener('scroll', ['$event.target'])
  onScroll(elem){
    if(( elem.offsetHeight + elem.scrollTop) >=  elem.scrollHeight) {
      this.isLoaded = false;
      this.currentPage = this.currentPage + 1;
      if (this.currentPage < this.totalPages) {
        this.mainService.fetchOnlyApproved(this.currentPage, this.itemCount);
        this.isLoaded = true;
      }
    }
  }

  constructor(public mainService: MainService,
    public auctionService: AuctionService,
    public httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.isLoaded = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artworkArray']?.currentValue !== undefined && this.artworkArray !== null) {
      if (this.artworkArray !== null) {
        this.artworks = this.artworkArray;
        this.artworkArray = this.artworkArray
        this.ngxService.stop();
        this.categories = this.artworks.map(item => item.category)
        .filter((value, index, self) => self.indexOf(value) === index);
        const assetType = this.artworks.map(item => item.assetType)
        .filter((value, index, self) => self.indexOf(value) === index);
        this.categories = this.categories.concat(assetType);
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
    this.categorySelected = category;
    if (category === 'all') {
      return this.artworkArray = this.artworks;
    } else {
      if (category.toLowerCase() === 'physical' || category.toLowerCase() === 'digital') {
        this.artworkArray = this.artworks.filter(item => {
          return item.assetType.toLowerCase() === category.toLowerCase();
        });
        this.artworkArray = this.artworkArray;
      } else  {
        this.artworkArray = this.artworks.filter(item => {
          return item.category.toLowerCase()  === category.toLowerCase();
        });
        this.artworks = this.artworkArray;
      }
    }
  }




  byId(index, item) {
    return item.id;
  }


  loadMore(e: any) {
    this.isLoaded = false;
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchOnlyApproved(this.currentPage, this.itemCount);
    this.isLoaded = true;
  }

}
