import { NgxSpinnerService } from 'ngx-spinner';

import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IArtwork } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { AuctionService } from '../../services/auction.service';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() public artworkArray: IArtwork [];
  @Input() public parentPage: string;
  artworks: IArtwork [] = [{"id": "","category": "","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "",
            "collections": [],"type": ""},"featuredImage": {"media": "","mediaType": 0},"isBidding": true, "gallery": [{ "media": "",
            "mediaType": 0 }], "description": "", "price": 0, "currency": "", "dateIssued": new Date(),"hasActiveAuction": true, "lastAuctionId": 0, "likes": 0, "sold": false, "name": "", "tokenId": 0, "symbol": "", "assetType": "digital", "type": ""}]
  unsold: any;
  categories: string [];
  another: any [];
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  newArtworkArray: IArtwork[] = [];
  constructor(public mainService: MainService, private spinner: NgxSpinnerService, public auctionService: AuctionService) { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '768px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  }

  ngOnInit(){
    this.another = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artworkArray']) {
        if (this.artworkArray !== null) {
          this.newArtworkArray = this.artworkArray;
          this.newArtworkArray.sort((a, b) => (a.dateIssued > b.dateIssued ? -1 : 1));
          this.artworkArray = this.newArtworkArray.slice(0,10);
          this.categories = this.artworkArray.map(item => item.category)
          .filter((value, index, self) => self.indexOf(value) === index);
        }
    }
    
  }

  categoryFilter(category) {
    this.artworkArray = this.newArtworkArray.filter(item => {
      return item.category === category;
    });
  }

  sort(data) { //to be implemented for sort by date when we implement the sort feature
    this.artworks = this.newArtworkArray.sort((a, b) => (a.dateIssued > b.dateIssued ? -1 : 1));
  }

  filterArtworks(data) { //to be implemented for filter when we implement the filter feature
    this.unsold = data.filter((res: IArtwork) =>res['sold'] === false);
  }

}
