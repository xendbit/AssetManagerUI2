import { Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Component, OnInit } from '@angular/core';
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
  images: any;
  audios: any;
  videos: any;
  error: any;

  constructor(public assetService: AssetsService, public router: Router, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getAssets();
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.from) {
                    this.pageHistory = window.history.state.from;
                    console.log('this is page history', this.pageHistory)
                } else {
                  this.pageHistory = 'buyPage';
                }
            },
            err => {
                console.log(err);
            },
            () => { }
        );
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      this.assetService.stopSpinner();
      // // // this.assets.forEach(element => {
      // // //   console.log('this is one', element)
      // // //   if (element.media.length > 0 ) {
      // // //     if (element.category === 'artwork') {
      // // //       console.log('matched')
      // // //       const image = element.media.filter(x => {
      // // //         return x.mediaKey ==='image';
      // // //       })[0];
      // // //       const mp4 = element.media.filter(x => {
      // // //         return x.mediaKey ==='mp4';
      // // //       })[0];
      // // //       this.images.push({name: element.name, image: image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
      // // //     }
      // // //     console.log('this is images', this.images)
         

      // // //     if(element.category === 'musicRight') {
      // // //       const mp3 = element.media.filter(x => {
      // // //         console.log('this is ex', x)
      // // //         return x.mediaKey ==='mp3';
      // // //       })[0];
      // // //       const image =  element.media.filter(x => {
      // // //         return x.mediaKey ==='image';
      // // //       })[0]; 
            
      // // //       this.audios.push({name: element.name, image: image, audio: mp3, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
      // // //       console.log('this is audio', this.audios)
      // // //     }
      // // //     if(element.category === 'movieRight') {
      // // //       const mp4 = element.media.filter(x => {
      // // //         return x.mediaKey ==='mp4';
      // // //       })[0];
      // // //       const image =  element.media.filter(x => {
      // // //         return x.mediaKey ==='image';
      // // //       })[0];   
            
      // // //       this.videos.push({name: element.name, image:image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
      // // //       console.log('this is videos', this.videos)
      // // //     }
       
         
      // //   }
      //   // console.log('these are images', this.images);
      // });
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
