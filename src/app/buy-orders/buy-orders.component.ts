import { Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy-orders',
  templateUrl: './buy-orders.component.html',
  styleUrls: ['./buy-orders.component.css']
})
export class BuyOrdersComponent implements OnInit {
    buyOrders: any[];
    sellOrders: any;
  userId: string;
  assets: any;
  primaryMarket: any[];
  totalBuyOrders: any;
  totalSellOrders: any;
  totalOrders: any;
  cancelled: boolean;
  orderId: any;

  constructor(public assetService: AssetsService, public router: Router) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.cancelled = false;
    this.getAssets();
    this.getBuyOrders();
    this.getSellOrders();
  }


  getBuyOrders() {
      this.assetService.ordersByBuyer(this.userId).subscribe(data => {
          this.buyOrders = data['data']['items'];
          this.totalBuyOrders = data['data']['meta']['totalItems'];
      },
      err => {
          console.log(err);
          this.assetService.stopSpinner();
      },
      () => { }
      );
  }

  getSellOrders() {
      this.assetService.ordersBySeller(this.userId).subscribe(sell => {
        this.sellOrders = sell['data']['items'];
        this.assetService.stopSpinner();
        console.log('this is data', sell['data']['items']);
        this.totalSellOrders = sell['data']['meta']['totalItems'];
        this.totalOrders = this.totalBuyOrders + this.totalSellOrders;
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

  imitate(orderId) {
    console.log('this is order', orderId);
    this.orderId = orderId;
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
      let init = []
      let second = []
      this.assets.forEach(element => {
        if (element.market === 0 && element.approved === 1 ) {
          init.push(element);
        } else if (element.market === 1) {
          second.push(element);
        }
      });
      this.primaryMarket =  init ;
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => { }
    );
  }

  viewBuy(tokenId, page) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: page} });
  }


}
