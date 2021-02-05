import { Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-typography',
  templateUrl: './sell-asset.component.html',
  styleUrls: ['./sell-asset.component.css']
})
export class SellAssetComponent implements OnInit {
  error: any;
  assets: any;
  orderStrategy: any;
  assetChosen: any;
  amount: any;
  price: any;
  asset: any;
  userId: string;

  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    
    this.getAssets();
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAssetsByOwnerId(this.userId).subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
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


  /* select(selectAsset: NgForm) {
    console.log('this is form', this.assetChosen);
    this.assetService.getAssetsByTokenId(this.assetChosen).subscribe(data => {
      console.log('this is data for asset', data);
      this.asset = data['data'];
    })
    this.hideArtDetails('visible');
  } 

  hideArtDetails(visibility) {
    var hiddenItems = document.getElementsByClassName('hiddenObject');
    for (var i = 0; i < hiddenItems.length; i++) {
        var htmlObj = <HTMLElement> hiddenItems[i];
        htmlObj.style.visibility = visibility;
    }
} */


view(tokenId, page) {
  this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
}

  onOptionsSelected(value:string){
    console.log("the selected value is " + value);
}

viewAll() {
  this.router.navigateByUrl('/assets', { state: {from: 'buyPage'}});;
}

}
