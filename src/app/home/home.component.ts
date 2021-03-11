import { Component, OnInit } from '@angular/core';
import { AssetsService } from '../services/assets.service';
import { Router } from '@angular/router';



declare var $: any;

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
  primaryMarket: any;
  secondaryMarket: any[];
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
  exclusive: any[];
  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('userId')) {
      this.userId = parseInt(localStorage.getItem('userId'));
    }
    
    this.getAssets();
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = [];
      let second = [];
      let exclu = [];
      // this.assets.forEach(elem => {
      //   if (elem.market === 0 && elem.approved === 1 && elem.totalSupply === 1 && elem.sharesAvailable === 1) {
      //     exclu.push(elem);
      //   }
      // })
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 && element.sharesAvailable === 1) {
          init.push(element);
        } else if (element.market === 1 && element.approved === 1) {
          second.push(element);
        } 
      });
      this.primaryMarket =  init ;
      this.secondaryMarket = second;
      this.exclusive = exclu;
      this.assetService.stopSpinner();
      console.log('this is exclusive market', this.exclusive)
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

  viewSell(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
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
