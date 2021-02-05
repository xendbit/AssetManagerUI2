import { LoginService } from './../services/login.service';
import { AdminService } from './../services/admin.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AssetsService } from './../services/assets.service';

@Component({
  selector: 'app-approve-assets',
  templateUrl: './approve-assets.component.html',
  styleUrls: ['./approve-assets.component.css']
})
export class ApproveAssetsComponent implements OnInit {
  assets: any;
  error: any;
  assetChosen: any;
  unapproved: any[];
  approved: any[];

  constructor(public assetService: AssetsService, public router: Router, public adminService: AdminService,
    public loginService: LoginService) { }

  ngOnInit(): void {
    this.unapproved = null;
    this.getAssets();
  }


  getAssets() {
    this.assetService.showSpinner()
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
      this.unapproved = init;
      console.log('this is unapproved', this.unapproved)
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

  approve(tokenId, status) {
    this.loginService.approve(tokenId, status).subscribe(res => {
      console.log('this is response', res);
      if (res['status'] === 'success') {
        this.assetService.showNotification('top', 'center', 'Asset has been approved successfully', 'success');
        this.getAssets();
      }
    })
  }

  view(tokenId) {
    this.router.navigateByUrl('/viewAsset', { state : {tokenId: tokenId, from: 'approvePage'} });
  }


}
