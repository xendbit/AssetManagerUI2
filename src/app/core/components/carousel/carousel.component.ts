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
  artworks: IArtwork [] = [{"id": "","category": "","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "",
            "collections": [],"type": ""},"featuredImage": {"media": "","mediaType": 0},"isBidding": true, "gallery": [{ "media": "",
            "mediaType": 0 }], "description": "", "price": 0, "currency": "", "dateIssued": new Date(),"hasActiveAuction": true, "lastAuctionId": 0, "likes": 0, "sold": false, "name": "", "tokenId": 0, "symbol": "", "assetType": "digital", "type": ""}]
  unsold: any;
  categories: string [];
  another: any [];
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
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
          this.artworks = this.artworkArray.slice(-10);
          this.categories = this.artworks.map(item => item.category)
          .filter((value, index, self) => self.indexOf(value) === index);
          const _this = this;
          this.artworks.forEach((artwork) => {
            this.auctionService.fetchAuctionFromMain(artwork.tokenId, artwork.lastAuctionId).subscribe(res => {
              if (res !== undefined) {
                this.another.push({
                  ...artwork,
                  auction: res
                })
              }
            })
           
          })
        }
    }
    
  }

  categoryFilter(category) {
    this.artworkArray = this.artworks.filter(item => {
      return item.category === category;
    });
  }

  sort(data) { //to be implemented for sort by date when we implement the sort feature
    let today = Date.now();
    this.artworks = data.sort((a, b) => today - new Date(data.dateIssued * 1000).getTime());
  }

  filterArtworks(data) { //to be implemented for filter when we implement the filter feature
    this.unsold = data.filter((res: IArtwork) =>res['sold'] === false);
  }

}
