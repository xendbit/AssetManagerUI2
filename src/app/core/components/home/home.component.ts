import { AuctionService } from './../../services/auction.service';
import { Component, OnInit } from '@angular/core';
import { IBlogGroup } from '../blog/blog.interfaces';
import { IArtwork, IPresentation } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slide: IPresentation;
  blogs: IBlogGroup;
  artworks: IArtwork [];
  another: any;
  categoryToIds: Map<string, Array<number> >
  presentationData: IPresentation = {
    "slides":  [
      {
        "id": "",
        "category": "",
        "tags": [],
        "auctions": { "auctionId": "",
        "cancelled": false, "chain": "", "currentBlock": "", "endBlock": "", "endDate": "", "finished": false, "highestBid": "",
        "highestBidder": "", "id": 0, "minimumBid": "", "owner": "", "sellNowPrice": "", "sellNowTriggered": false,
        "startBlock": "", "startDate": "", "started": true, "tokenId": ""},
        "owner": {
            "id": "",
            "image": "",
            "username": ""
        },
        "creator": {
            "id": "",
            "image": "",
            "username": "",
            "collections": [],
            "type": ""
        },
        "featuredImage": {
            "media": "/assets/img/slide1.jpeg",
            "mediaType": 0
        },
        "isBidding": true,
        "gallery": [],
        "description": "Description",
        "price": 0,
        "currency": "ETH",
        "likes": 0,
        "type": "Artwork",
        "lastAuctionId": 0,
        "hasActiveAuction": true,
        "symbol": "",
        "tokenId": 0,
        "name": "",
        "dateIssued": new Date(),
        "assetType": "digital",
        "sold": false
      },
    ],
  "presentationType": 1
  };
  
  transitions = '150ms cubic-bezier(0, 0, 0.2, 1)';

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  constructor(public mainService: MainService, public auctionService: AuctionService) { }

  ngOnInit() {
    this.mainService.returnArtwork().subscribe((data: IArtwork []) => {
      if (data !== null) {
        this.artworks = data;
        this.another = data
      }
    }, err => {
      console.log('artwork error =>', err)
    });
    this.mainService.getPresentation().subscribe(async (res: any) => {
      this.slide = await res;
    }, err => {
      console.log('presentation error =>', err)
    });
    this.mainService.getDrops().subscribe(async (res: any) => {
      if (res !== null) {
        this.presentationData = await res;
      }
    }, err => {
      console.log('Drops error => ', err);
    })
    this.mainService.getBlogPost().subscribe((data: IBlogGroup) => {
      this.blogs = data;
    }, err => {
      console.log('blog error =>', err)
    });
  }



}
