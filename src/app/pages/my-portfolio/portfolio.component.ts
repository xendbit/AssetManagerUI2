import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
declare var $: any;
declare let window: any;
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  assets: any;
  userId: string;
  primaryMarket: any[];
  secondaryMarket: any[];
  myAssets: any;
  totalItems: any;
  balance: any;
  isConnected: boolean;
  account: any;
  images: any[];
  videos: any[];
  audios: any[];
  userAgent: any;

  constructor(public assetService: AssetsService, public router: Router, private activeRoute: ActivatedRoute, { nativeElement }: ElementRef<HTMLImageElement>) { 
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
    this.getAllAssets();
 
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getMetamaskInfo().then(data => {
      this.account = data.account;
      this.balance = data.balance;
      this.assetService.getAssetsByOwnerId(this.account).subscribe(data => {
        const res = data['data']['items'];
        let initial = [];
        let finalData = [];
        res.forEach( element => {
          if (element.media.length > 0 ) {
            if (element.category === 'artwork') {
              const image = element.media.filter(x => {
                return x.mediaKey ==='image';
              })[0];
              const mp4 = element.media.filter(x => {
                return x.mediaKey ==='mp4';
              })[0];
              this.images.push({name: element.name, image: image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
            } else {
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
            console.log('this vid', this.videos)
          }
          
      })
        this.assetService.stopSpinner();
      },
      err => {
          console.log(err);
          this.assetService.stopSpinner();
      },
      () => { }
      );
    
    }, err => {
        console.log(err);
        this.assetService.stopSpinner();
    })

   
   
  }

  view(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }

  getAllAssets() {
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      let primary = [];
      let secondary = [];
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          primary.push(element);
        } else if (element.market === 1 && element.approved === 1) {
          secondary.push(element);
        }
      });
      this.primaryMarket =  primary ;
      this.secondaryMarket = secondary;
      this.assetService.stopSpinner();
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => { 
      this.assetService.stopSpinner();
    }
    );
  }

}
