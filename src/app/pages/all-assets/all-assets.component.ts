import { Router } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { Component, OnInit, ElementRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-assets',
  templateUrl: './all-assets.component.html',
  styleUrls: ['./all-assets.component.css']
})
export class AllAssetsComponent implements OnInit {
  assets: any;
  pageHistory: any;
  approved: any[];
  unapproved: any[];
  primaryMarket: any[];
  secondaryMarket: any[];
  exclusive: any[];
  images: any[];
  videos: any[];
  audios: any[];
  error: any;
  userAgent: string;

  constructor(public assetService: AssetsService, public router: Router, public activatedRoute: ActivatedRoute, { nativeElement }: ElementRef<HTMLImageElement>) { 
    const supports = 'loading' in HTMLImageElement.prototype;
    if (supports) {
      nativeElement.setAttribute('loading', 'lazy');
    }
  }

  ngOnInit() {
    this.audios = [];
    this.images = [];
    this.videos = [];
    var ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.userAgent = 'mobile';
    } else if(/Chrome/i.test(ua)) {
      this.userAgent = 'chrome';
    } else {
      this.userAgent = 'desktop';
    }
    this.getAssets();
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      this.assets.forEach(element => {
        if (element.media.length > 0  && element.hasActiveAuction === true) {
          if (element.category === 'artwork') {
            const image = element.media.filter(x => {
              return x.mediaKey ==='image';
            })[0];
            const mp4 = element.media.filter(x => {
              return x.mediaKey ==='mp4';
            })[0];
            this.images.push({name: element.name, image: image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
          }
         

          if(element.category === 'musicRight') {
            const mp3 = element.media.filter(x => {
              return x.mediaKey ==='mp3';
            })[0];
            const image =  element.media.filter(x => {
              return x.mediaKey ==='image';
            })[0]; 
            
            this.audios.push({name: element.name, image: image, audio: mp3, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
          }
          if(element.category === 'movieRight') {
            const mp4 = element.media.filter(x => {
              return x.mediaKey ==='mp4';
            })[0];
            const image =  element.media.filter(x => {
              return x.mediaKey ==='image';
            })[0];   
            
            this.videos.push({name: element.name, image:image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
          }
        }
        this.assetService.stopSpinner();
      } )
 
      
    }, err => {
      this.assetService.stopSpinner();
      console.log(err.error.data.error);
      this.error = err.error.data.error;
    },
    () => { 
      this.assetService.stopSpinner();
    });
  }
  
  view(tokenId, market) {
    if (market === 0) {
      this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: this.pageHistory} });
    } else if (market === 1) {
      this.router.navigateByUrl('/view-sec', { state : {tokenId: tokenId, from: this.pageHistory} });
    }
  }

  viewOrder(tokenId) {
    this.router.navigateByUrl('/view-sec', { state : {tokenId: tokenId} });
  }

}
