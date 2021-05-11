import { Component, OnInit } from '@angular/core';
import { AssetsService } from '../services/assets.service';
import { Router } from '@angular/router';



declare var $: any;
declare let window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  assets: any;
  orderStrategy: any;
  assetChosen: any;
  amount: any;
  price: any;
  error: any;
  userId: number;
  demoCategories: { imageUrl: string,  type: string }[] = [
    { "imageUrl": '/assets/img/Oil-painting.jpg',  type: "Oil Painting" },
    { "imageUrl": '/assets/img/Casein-Painting.jpg',  type: "Casein Painting" },
    { "imageUrl": '/assets/img/WATERCOLOUR.jpg',  type: "Water color painting" },
    { "imageUrl": '/assets/img/Miniature.jpg',  type: "Miniature Painting" },
    { "imageUrl": '/assets/img/Anamorphosis.jpg',  type: "Anamorphosis painting" },
    { "imageUrl": '/assets/img/AERIAL-PERSPECTIVE.jpg',  type: "Aerial Perspective" },
    { "imageUrl": '/assets/img/ACTION.jpg',  type: "Action" },
    { "imageUrl": '/assets/img/Tempera.jpg',  type: "Tempera" },
    { "imageUrl": '/assets/img/Gouache.jpg',  type: "Gouache painting" },
    { "imageUrl": '/assets/img/Encaustic.jpg',  type: "Encuastic painting" },
    { "imageUrl": '/assets/img/COLLAGE.jpg',  type: "Collage painting" },
    { "imageUrl": '/assets/img/BALL-POINT.jpeg',  type: "Ballpoint painting" },
    { "imageUrl": '/assets/img/Ink-PAinting.jpg',  type: "Ink painting" },
    { "imageUrl": '/assets/img/CHARCOAL.jpg',  type: "Charcoal painting" },
    { "imageUrl": '/assets/img/ACRYLIC.jpg',  type: "Acrylic painting" },
    { "imageUrl": '/assets/img/DIGITAL.jpg',  type: "Digital painting" }
  ];
  shares: any;
  images: any[];
  videos: any[];
  audios: any[];
  account: any;
  isConnected: boolean;
  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    this.audios = [];
    this.images = [];
    this.videos = [];
    // if (localStorage.getItem('userId')) {
    //   this.userId = parseInt(localStorage.getItem('userId'));
    // }
    
    this.getAssets();
    this.assetService.getMetamaskInfo().then(data => {
      this.account = data.account;
      if (window.ethereum.isConnected() && this.account !== undefined) {
        this.isConnected = true;
      } else {
        this.isConnected = false;
      }
    
    });
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      this.assetService.stopSpinner();
      this.assets.forEach(element => {
        if (element.media.length > 0 && element.hasActiveAuction === true ) {
          if (element.category === 'artwork') {
            const image = element.media.filter(x => {
              return x.mediaKey ==='image';
            })[0];
            const mp4 = element.media.filter(x => {
              return x.mediaKey ==='mp4';
            })[0];
            this.images.push({name: element.name, image: image, video: mp4, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
          }
          console.log('this is images', this.images)
         

          if(element.category === 'musicRight') {
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
        // console.log('these are images', this.images);
      });
      this.assetService.stopSpinner();
    }, err => {
      this.assetService.stopSpinner();
      console.log(err.error.data.error);
      this.error = err.error.data.error;
    },
    () => { 
      this.assetService.stopSpinner();
    });
  }
  

  viewBuy(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }

  viewSec(tokenId, page) {
    console.log('clicked')
    this.router.navigateByUrl('/view-sec', { state : {tokenId: tokenId, from: page} });
  }

  viewOrder(tokenId) {
    this.router.navigateByUrl('/view-sec', { state : {tokenId: tokenId} });
  }

  logout() {
    this.router.navigateByUrl('/login');
  }

  signup() {
    this.router.navigateByUrl('/register');
  }

  goToAllAssets(page) {
    this.router.navigateByUrl('/assets', { state : { from: page} });
  }

  // getOwnedShares() {
  //   this.assetService.getOwnedShares(this.userId, this.tokenId).subscribe((res: any) => {
  //     console.log('this is response for shares', res);
  //     this.shares = res['data'];
  //   },
  //   err => {
  //       console.log(err);
  //       this.assetService.stopSpinner();
  //   },
  //   () => { }
  //   );
  // }

}
