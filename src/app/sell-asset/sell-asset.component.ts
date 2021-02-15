import { LoginService } from './../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
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
  userId: any;
  remainingShares: any;
  buyOrders: any[];
  sellOrders: any[];
  tokenId: any;
  unavailable: boolean;
  sharesRemaining: boolean;

  constructor(public assetService: AssetsService, public router: Router, public loginService: LoginService,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.activatedRoute.paramMap
        .subscribe(
            () => {
                if (window.history.state.tokenId) {
                    this.userId = parseInt(localStorage.getItem('userId'));
                    this.tokenId = window.history.state.tokenId;
                    this.getSellOrders();
                    this.getAssetDetails();
                    this.getPrimarySharesRemaining(this.tokenId);
                    this.checkShares(this.tokenId);
                   
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
    },
    err => {
        console.log(err);
        this.assetService.stopSpinner();
    },
    () => {
     }
    );

  }

  getPrimarySharesRemaining(tokenId) {
    this.loginService.checkSharesRemaining(tokenId).pipe(first()).subscribe(res => {
      console.log('this is remaining shares', res);
      this.remainingShares = res['data'];
    })
  }

  changeMarket() {
    this.assetService.showSpinner();
    this.assetService.changeMarket(this.tokenId).pipe(first()).subscribe((res: any) => {
      console.log('this is response', res);
      if (res['status'] === 'success') {
        this.assetService.showNotification('top', 'center', 'Asset has been listed successfully on the secondary market!', 'success');
        this.assetService.stopSpinner();
        this.getAssetDetails();       
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


  checkShares(tokenId) {
    this.loginService.checkSharesRemaining(tokenId).pipe(first()).subscribe(res => {
      console.log('this is remaining shares', res);
      if (res['data'] !== null || res['data'] !== undefined) {
        this.remainingShares = res['data'];
        this.sharesRemaining = true;
      }
    },
    err => {
        console.log(err);
    })
  }

  delete(tokenId, status) {
    this.assetService.showSpinner();
    this.loginService.underSubscribe(tokenId).subscribe(res => {
      if (res['status'] === 'success') {
            this.assetService.showNotification('top', 'center', 'Asset has been deleted successfully', 'success');
            this.getAssetDetails();       
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
            console.log('this is order', element);
            second.push(element);
          } else {
            last.push(element);
          }
        });
  
       
  
        this.sellOrders = second;
        this.buyOrders = last;
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
