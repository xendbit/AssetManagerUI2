import { AdminService } from './../services/admin.service';
import { AssetsService } from './../services/assets.service';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-assets',
  templateUrl: './admin-assets.component.html',
  styleUrls: ['./admin-assets.component.css']
})
export class AdminAssetsComponent implements OnInit {
  assets: any;
  remainingShares: any;
  sharesRemaining: boolean;
  assetToken: any;

  constructor(public assetService: AssetsService, public loginService: LoginService, public adminService: AdminService) { }

  ngOnInit(): void {
    this.getAssets();
  }

  getAssets() {
    this.assetService.showSpinner();
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
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

  delete(tokenId, status) {
    this.assetService.showSpinner();
    this.loginService.underSubscribe(tokenId).subscribe(res => {
      if (res['status'] === 'success') {
            this.assetService.showNotification('top', 'center', 'Asset has been deleted successfully', 'success');
            this.getAssets();       
      }
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

  checkShares(tokenId) {
    this.loginService.checkSharesRemaining(tokenId).pipe(first()).subscribe(res => {
      console.log('this is remaining shares', res);
      this.assetToken = tokenId;
      if (res['data'] !== null || res['data'] !== undefined) {
        this.remainingShares = res['data'];
        this.sharesRemaining = true;
      }
    },
    err => {
        console.log(err);
    })
  }

  changeMarket() {
    this.assetService.showSpinner();
    this.assetService.changeMarket(this.assetToken).pipe(first()).subscribe((res: any) => {
      console.log('this is response', res);
      if (res['status'] === 'success') {
        this.assetService.showNotification('top', 'center', 'Asset has been listed successfully on the secondary market!', 'success');
        this.assetService.stopSpinner();
        this.getAssets();       
      } else {
        this.assetService.showNotification('top', 'center', 'There has been an error while trying to list asset, please try again!', 'danger');
        this.assetService.stopSpinner();
      }
     
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
