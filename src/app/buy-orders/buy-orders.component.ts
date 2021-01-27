import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';

@Component({
  selector: 'app-buy-orders',
  templateUrl: './buy-orders.component.html',
  styleUrls: ['./buy-orders.component.scss']
})
export class BuyOrdersComponent implements OnInit {
  buyOrders: any[];
  sellOrders: any;
userId: string;
assets: any;
approved: any[];
unapproved: any[];

  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.getAssets();
    this.getBuyOrders();
    this.getSellOrders();
  }


  getBuyOrders() {
    this.assetService.showSpinner();
      this.assetService.ordersByBuyer(this.userId).subscribe(data => {
          this.buyOrders = data['data']['items'];
          this.assetService.stopSpinner();
      })
  }

  getSellOrders() {
    this.assetService.showSpinner();
      this.assetService.ordersBySeller(this.userId).subscribe(sell => {
        this.sellOrders = sell['data']['items'];
        this.assetService.stopSpinner();
        console.log('this is data', this.sellOrders);
        })
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.approved === 0 ) {
          init.push(element);
        } else if (element.approved === 1) {
          second.push(element);
        }
      });
      this.approved =  second ;
      console.log('this is approved', this.approved)
      this.unapproved = init;
      this.assetService.showSpinner();
    })
  }

  viewBuy(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }




}
