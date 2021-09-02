import { Component, OnInit, ElementRef  } from '@angular/core';
import { AssetsService } from '../../services/assets.service';
import {  Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';



declare var $: any;
declare let window: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

// @Directive({ selector: 'img' })
export class HomeComponent implements OnInit {
  assets: any;
  orderStrategy: any;
  assetChosen: any;
  amount: any;
  price: any;
  error: any;
  userId: number;
  currentMsgToChild: any;
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
  mainCategories: {id: number, type: string}[] = [
    {id: 1, type: 'images'},
    {id: 2, type: 'audios'},
    {id: 3, type: 'videos'}
  ]
  shares: any;
  images: any[];
  videos: any[];
  audios: any[];
  account: any;
  isConnected: boolean;
  userAgent: string;
  randomArt: any;
  randomMusic: any;
  randomVideo: any;
  randomAudio: any;
  form: FormGroup;
  constructor(public assetService: AssetsService, public fb: FormBuilder, public router: Router, { nativeElement }: ElementRef<HTMLImageElement>,
    public domSanitizer: DomSanitizer) {
    const supports = 'loading' in HTMLImageElement.prototype;
    if (supports) {
      nativeElement.setAttribute('loading', 'lazy');
    }
    this.form = fb.group({
      'mainCategories': this.mainCategories,
  });
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
            this.randomVideo = this.videos[(Math.random() * this.videos.length) | 0];
            this.randomArt = this.images[(Math.random() * this.images.length) | 0];
            this.randomMusic = this.audios[(Math.random() * this.audios.length) | 0];
            this.randomAudio = this.domSanitizer.bypassSecurityTrustUrl(this.randomMusic.audio.media);

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

  getCategory(item) {
    console.log('this is item', item);
    this.currentMsgToChild = item;
  }
  

  viewBuy(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }

  viewSec(tokenId, page) {
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

}
