import { AssetsService } from './../services/assets.service';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-assets',
  templateUrl: './admin-assets.component.html',
  styleUrls: ['./admin-assets.component.css']
})
export class AdminAssetsComponent implements OnInit {
  assets: any;

  constructor(public assetService: AssetsService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.getAssets();
  }

  getAssets() {
    this.assetService.getAllAssets().subscribe(data => {
      this.assets = data['data']['items'];
      console.log('this is assets, ', data['data']['items']);
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

}
