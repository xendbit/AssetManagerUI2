import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from '../services/assets.service';
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

  constructor(public assetService: AssetsService, public router: Router, private activeRoute: ActivatedRoute) { }
  ngOnInit() {
    this.audios = [];
    this.images = [];
    this.videos = [];
    this.getAssets();
    this.getAllAssets();
 
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getMetamaskInfo().then(data => {
      this.account = data.account;
      console.log('this is user', this.userId)
      // this.displayedData = data.displayedData;
      this.balance = data.balance;
      this.assetService.getAssetsByOwnerId(this.account).subscribe(data => {
        console.log('this is data gotten', data);
        const res = data['data']['items'];
        let initial = [];
        let finalData = [];
        res.forEach( element => {
          if (element.media.length > 0 ) {
            if (element.category === 'artwork') {
              console.log('yes')
              const image = element.media.filter(x => {
                return x.mediaKey ==='image';
              })[0];
              const mp4 = element.media.filter(x => {
                return x.mediaKey ==='mp4';
              })[0];
              this.images.push({name: element.name, image: image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
            } else {
              console.log('there is none')
            }
            console.log('this is images', this.images)
           
  
            if(element.category === 'musicRight') {
              console.log('yes!')
              const mp3 = element.media.filter(x => {
                console.log('this is ex', x)
                return x.mediaKey ==='mp3';
              })[0];
              const image =  element.media.filter(x => {
                return x.mediaKey ==='image';
              })[0]; 
              
              this.audios.push({name: element.name, image: image, audio: mp3, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
              console.log('this is audio', this.audios)
            }
            if(element.category === 'movieRight') {
              console.log('yes!!')
              const mp4 = element.media.filter(x => {
                return x.mediaKey ==='mp4';
              })[0];
              const image =  element.media.filter(x => {
                return x.mediaKey ==='image';
              })[0];   
              
              this.videos.push({name: element.name, image:image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
              console.log('this is videos', this.videos)
            }
          }
          
      })
        this.assetService.stopSpinner();
        console.log('these are my assets, ', this.myAssets);
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
      console.log('this is assets, ', data['data']['items']);
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
      console.log('primary', primary)
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
