import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';
declare var $: any;
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

  constructor(public assetService: AssetsService, public router: Router) { }
  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.getAssets();
    this.getAllAssets();
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAssetsByOwnerId(this.userId).subscribe(data => {
      const res = data['data']['items'];
      let initial = [];
      res.forEach(element => {
        if (element.market === 0 && element.approved === 1 || element.market === 1 && element.approved ===1 ) {
          initial.push(element);
        } 
      });
      this.myAssets = initial;
      this.assetService.stopSpinner();
      console.log('these are my assets, ', this.myAssets);
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => { }
    );
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
