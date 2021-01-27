import { Component, OnInit } from '@angular/core';
import { LoginService } from './../services/login.service';
import { AdminService } from './../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from './../services/assets.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  assets: any;
  error: any;
  assetChosen: any;
  unapproved: any[];
  approved: any[];
  asset: any;
  tokenId: any;
  sellOrders: any;
  unavailable: boolean;

  constructor(public assetService: AssetsService, public router: Router, public adminService: AdminService,
    public loginService: LoginService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.tokenId) {
                    console.log('this is what i got', window.history.state.tokenId)
                    this.tokenId = window.history.state.tokenId;
                    this.getSellOrders();
                }
            },
            err => {
                console.log(err);
            },
            () => { }
        );
  }

  getAssetDetails() {
    this.assetService.getAssetsByTokenId(this.tokenId).pipe(first()).subscribe(data => {
      console.log('this is data for asset', data);
      this.asset = data['data'];
    })

}

approve(tokenId, status) {
  console.log('this is token', tokenId)
  this.loginService.approve(tokenId, status).subscribe(res => {
    console.log('this is response', res);
    if (res['status'] === 'success') {
      this.assetService.showNotification('top', 'center', 'Asset has been approved successfully', 'success');
      this.router.navigateByUrl('/admin-dashboard');
    }
  })
}

getSellOrders() {
  this.assetService.showSpinner();
    this.assetService.ordersByTokenId(this.tokenId).subscribe(sell => {
      console.log('these are orders', sell);
      const assets = sell['data']['items'];
      let second = []
      let last = [];
      assets.forEach(element => {
        console.log('this is order type', element.orderType);
        if (element.orderType == 1 ) {
          second.push(element);
        } else {
          last.push();
        }
      });

      console.log('this is slast', last);
      
      this.sellOrders = second;
      this.assetService.stopSpinner();
      console.log('this is data', this.sellOrders);
      })
}

  view(tokenId) {
    this.tokenId = tokenId;
    this.getSellOrders();
  }

  viewAsset(price, id) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: this.tokenId, from: 'secPage', price: price, id: id} });
  }


}
