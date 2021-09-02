
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AssetsService } from '../../services/assets.service';
import { demo } from 'src/app/interfaces';

@Component({
  selector: 'app-featured-categories',
  templateUrl: './featured-categories.component.html',
  styleUrls: ['./featured-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedCategoriesComponent implements OnInit {
  @Input() msgFromParent: any;
  assets: any;
  audios: any;
  images: any;
  videos: any;
  error: any;
  demoItems: any;

  constructor(public assetService: AssetsService) { }

  ngOnInit(): void {
    this.demoItems = demo;
    console.log('this is demoItems', demo)
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      this.assets.forEach(element => {
        if (element.media.length > 0 && element.hasActiveAuction === true ) {
          this.assetService.getAuctionInfo(element.tokenId, element.lastAuctionId).subscribe(res => {
            if (element.category === 'artwork') {
              const image = element.media.filter(x => {
                return x.mediaKey ==='image';
              })[0];
              const mp4 = element.media.filter(x => {
                return x.mediaKey ==='mp4';
              })[0];
              this.images.push({name: element.name, image: image, video: mp4, tokenId: element.tokenId,
                symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, 
                dateIssued: element.dateIssued, sellNowPrice: res['data']['sellNowPrice'], highestBid:  res['data']['highestBid']})
            }
            if(element.category === 'musicRight') {
              const mp3 = element.media.filter(x => {
                return x.mediaKey ==='mp3';
              })[0];
              const image =  element.media.filter(x => {
                return x.mediaKey ==='image';
              })[0]; 
              this.audios.push({name: element.name, image: image, audio: mp3, tokenId: element.tokenId, 
                symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, 
                dateIssued: element.dateIssued, sellNowPrice: res['data']['sellNowPrice'], highestBid:  res['data']['highestBid']})
            }
            if(element.category === 'movieRight') {
              const mp4 = element.media.filter(x => {
                return x.mediaKey ==='mp4';
              })[0];
              const image =  element.media.filter(x => {
                return x.mediaKey ==='image';
              })[0];   
              
              this.videos.push({name: element.name, image:image, video: mp4, tokenId: element.tokenId, 
                symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, 
                dateIssued: element.dateIssued, sellNowPrice: res['data']['sellNowPrice'], highestBid:  res['data']['highestBid']})
            }
            // this.randomVideo = this.videos[(Math.random() * this.videos.length) | 0];
            // this.randomArt = this.images[(Math.random() * this.images.length) | 0];
            // this.randomMusic = this.audios[(Math.random() * this.audios.length) | 0];
            // this.randomAudio = this.domSanitizer.bypassSecurityTrustUrl(this.randomMusic.audio.media);

          })
          this.assetService.stopSpinner();
        }
      });
      this.assetService.stopSpinner();
    }, err => {
      this.assetService.stopSpinner();
      this.error = err.error.data.error;
    },
    () => { 
      this.assetService.stopSpinner();
    });
  }


}
