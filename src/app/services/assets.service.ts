import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import * as Web3 from 'web3';

declare var $: any;
declare let require: any;
declare let window: any;

@Injectable({
    providedIn: 'root'
  })
  export class AssetsService {

    constructor(public httpClient: HttpClient, public spinner: NgxSpinnerService) {
      console.log('tji', window.web3)
      if (typeof window.web3 !== 'undefined') {
        this.web3Provider = window.web3.currentProvider;
      } else {
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
   
      window.web3 = new Web3(this.web3Provider);
      }

    baseUrl = 'http://35.224.252.52:8080/v3';
    private web3Provider: any;
    api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';

    listing() {
      return this.httpClient.get(`${this.baseUrl}/assets/listings`);
    }

    issue(body) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.post(`${this.baseUrl}/assets/issue-asset`, body, {headers});
    }

    transfers() {
      return this.httpClient.get(`${this.baseUrl}/assets/transfers`);
    }
    getUsers() {
        return this.httpClient.get(`${this.baseUrl}/assets/users`);
    }

    getAllAssets() {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets?page=1&limit=200`, {headers});
    }

    getOwnedShares(userId, tokenId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/user/owned-shares/${userId}/${tokenId}`, {headers});
    }

    getAssetsByIssuerId(userId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/by-issuer/${userId}?page=${1}&limit=15`, {headers});
    }

    cancelOrder(id) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.post(`${this.baseUrl}/assets/cancel-order/${id}`, {},  {headers})
    }

    fetchOrderById(orderId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/orders/${orderId}`, {headers});
    }

    getAssetsByOwnerId(userId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/by-owner/${userId}?page=${1}&limit=15`, {headers});
    }

    getAccountInfo() {
      console.log('==>', window.web3.eth)
      return new Promise((resolve, reject) => {
        window.web3.eth.getCoinbase(function(err, account) {
   
          if(err === null) {
            window.web3.eth.getBalance(account, function(err, balance) {
              if(err === null) {
                return resolve({fromAccount: account, balance:window.web3.fromWei(balance, "ether")});
              } else {
                return reject("error!");
              }
            });
          }
        });
      });
    }
   

    getAssetsByTokenId(tokenId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/by-token-id/${tokenId}`, {headers});
    }

    getWaletBalance(userId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/user/wallet-balance/${userId}`, {headers});
    }

    buyAsset(body) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.post(`${this.baseUrl}/assets/new-order`, body, {headers})
    }

    sellAsset(body) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.post(`${this.baseUrl}/assets/new-order`, body, {headers})
    }

    allOrders() {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/orders?page=1&limit=50`, {headers});
    }

    ordersByBuyer(buyerId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/orders/by-buyer/${buyerId}?page=1&limit=50`, {headers});
    }

    ordersBySeller(sellerId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/orders/by-seller/${sellerId}?page=1&limit=50`, {headers});
    }

    ordersByTokenId(tokenId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/assets/orders/by-token-id/${tokenId}?page=1&limit=50`, {headers});
    }

    getPassphrase() {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.get(`${this.baseUrl}/user/generate/passphrase`, {headers});
    }

    getCustomHeaders(): HttpHeaders {
      const headers = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('api-Key', this.api_key);
      return headers;
    }

    changeMarket(tokenId) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('api-key', this.api_key);
      return this.httpClient.post(`${this.baseUrl}/admin/conclude-primary-sales/${tokenId}`, {}, {headers});
    }


    showNotification(from, align, message, kind){
      const type = ['','info','success','warning','danger'];
    
      const color = Math.floor((Math.random() * 4) + 1);
    
      $.notify({
          icon: "notifications",
          message: message
    
      },{
          type: kind,
          timer: 4000,
          placement: {
              from: from,
              align: align
          },
          template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">notifications</i> ' +
            '<span data-notify="title" style="font-family: Inter, serif;">{1}</span> ' +
            '<span data-notify="message"  style="font-family: Inter, serif;">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
    }

    showSpinner() {
      this.spinner.show();
    }

    stopSpinner() {
      this.spinner.hide();
    }

   
  

  }
