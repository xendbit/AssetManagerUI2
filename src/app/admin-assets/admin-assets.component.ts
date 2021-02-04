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
    })
  }

  delete(tokenId, status) {
    this.loginService.approve(tokenId, status).subscribe(res => {
      console.log('this is response', res);
      if (res['status'] === 'success') {
        this.assetService.showNotification('top', 'center', 'Asset has been deleted successfully', 'success');
        this.getAssets();
      }
    })
  }

  changeMarket(tokenId) {
    this.assetService.showSpinner();
    this.assetService.changeMarket(tokenId, 1).pipe(first()).subscribe((res: any) => {
      console.log('this is response', res);
      this.assetService.stopSpinner();
    })
  }

}
