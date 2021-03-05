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
      let exclu = [];
      this.assets.forEach(element => {
        if (element.approved === 0 ) {
          init.push(element);
        } else if (element.approved === 1 && element.market !== 2) {
          second.push(element);
        } 
      });

      this.assets.forEach(elem => {
        if (elem.market === 0 && elem.approved === 1 && elem.totalSupply === 1 && elem.sharesAvailable === 1) {
          exclu.push(elem);
        }
      })
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
      this.exclusive = exclu;
      console.log('primary', primary)
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
