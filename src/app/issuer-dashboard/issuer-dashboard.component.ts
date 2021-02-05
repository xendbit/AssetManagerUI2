import { Component, OnInit } from '@angular/core';
import { AssetsService } from './../services/assets.service';

@Component({
  selector: 'app-issuer-dashboard',
  templateUrl: './issuer-dashboard.component.html',
  styleUrls: ['./issuer-dashboard.component.css']
})
export class IssuerDashboardComponent implements OnInit {
  orders: any;
  assets: any;
  totalItems: any;
  totalApproved: any;
  unapproved: any;
  approved: any[];
  error: any;

  constructor(public assetService: AssetsService) { }

  ngOnInit(): void {
    this.totalItems = 0;
    this.totalApproved = 0;
    this.getAllOrders();
    this.getUserAssets();
  }

  getAllOrders()  {
    this.assetService.showSpinner();
    this.assetService.allOrders().subscribe(data => {
      console.log('this is all orders', data);
      this.orders = data['data']['items'];
    }, err => {
      this.assetService.stopSpinner();
      console.log(err.error.data.error);
      this.error = err.error.data.error;
    });
  }

  getUserAssets() {
    const userId = localStorage.getItem('userId');
    this.assetService.getAssetsByIssuerId(userId).subscribe(res => {
      console.log('these are my assets',res);
      this.assets = res['data']['items'];
      this.totalItems = res['data']['meta']['totalItems'];
      const init = [];
      const second = [];
      this.assets.forEach(element => {
        if (element.approved === 0 ) {
          init.push(element);
        } else if (element.approved === 1) {
          second.push(element);
        }
      });
      this.unapproved =  init ;
      this.approved = second;
      this.totalApproved = second.length;
      console.log('this is approved', this.unapproved)
      this.assetService.stopSpinner();
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
        this.error = err.error.data.error;
    },
    () => { }
    );
  }

}
