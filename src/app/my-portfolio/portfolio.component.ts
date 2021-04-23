import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(public assetService: AssetsService, public router: Router) { }
  ngOnInit() {
    
     
    console.log('leke', this.account)
    
    this.getAssets();
    this.getAllAssets();
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getMetamaskInfo().then(data => {
      this.userId = data.account;
      this.account = data.account;
      console.log('this is user', this.userId)
      // this.displayedData = data.displayedData;
      this.balance = data.balance;
      console.log('confirmmmm', this.userId)
      this.assetService.getAssetsByOwnerId(this.userId).subscribe(data => {
        console.log('this is data gotten', data);
        const res = data['data']['items'];
        let initial = [];
        let finalData = [];
        res.forEach( element => {
          if (element.media.length > 0) {
            initial.push(element.media)
            initial.forEach(mel => {
              mel.forEach( data => {
                if (data.mediaKey === 'image') {
                if (element.media.find(elem => elem === data )){
                  finalData.push({name: element.name, data, tokenId: element.tokenId, symbol: element.symbol, owner: element.owner, issuer: element.issuer, id: element.id, dateIssued: element.dateIssued})
                }
                this.myAssets = finalData;
              }
          })
        })
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
