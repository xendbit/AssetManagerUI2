import { Router } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders: any;
  balance: any;
  totalItems: any;
  userAssets: any;
  userId: any;

  constructor(public assetService: AssetsService, public router: Router) { }
  
  ngOnInit() {
    this.totalItems = 0;
    this.balance = 0;
    this.getBalance();
    this.getTotalAssets();
    this.getAllOrders();
  }


  getAllOrders()  {
    this.assetService.allOrders().subscribe(data => {
      console.log('this is all orders', data);
      this.orders = data['data']['items'];
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

  getBalance() {
    this.assetService.showSpinner();
    this.userId = localStorage.getItem('userId');
    this.assetService.getWaletBalance(this.userId).subscribe(res => {
      console.log('this is balance', res);
      this.balance = res['data'];
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => { }
    );
  }

  view(tokenId) {
    console.log('this is token', tokenId)
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId} });
  }

  getTotalAssets() {
    this.assetService.getAssetsByOwnerId(this.userId).subscribe(res => {
      console.log('this is total assets owned', res);
      this.totalItems = res['data']['meta']['totalItems']
      this.userAssets = res['data']['items'];
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => { }
    );
  }

}
