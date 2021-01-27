import { Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-assets',
  templateUrl: './all-assets.component.html',
  styleUrls: ['./all-assets.component.scss']
})
export class AllAssetsComponent implements OnInit {
  assets: any;
  pageHistory: any;
  approved: any[];
  unapproved: any[];
  primaryMarket: any[];
  secondaryMarket: any[];

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
      let init = []
      let second = []
      let primary = [];
      let secondary = [];
      this.assets.forEach(element => {
        if (element.approved === 0 ) {
          init.push(element);
        } else if (element.approved === 1) {
          second.push(element);
        } 
      });
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          primary.push(element);
        } else if (element.market === 1 && element.approved === 1) {
          secondary.push(element);
        }
      });
      this.approved =  second ;
      this.unapproved = init;
      this.primaryMarket =  primary ;
      this.secondaryMarket = secondary;
      console.log('primary', primary)
      this.assetService.stopSpinner();
    })
  }

  view(tokenId) {
    if (this.pageHistory === 'primary') {
      this.pageHistory = 'buyPage';
    } else if (this.pageHistory === 'secondary') {
      this.pageHistory = 'sellPage';
    }
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: this.pageHistory} });
  }

  viewOrder(tokenId) {
    this.router.navigateByUrl('/asset-order', { state : {tokenId: tokenId} });
  }

}
