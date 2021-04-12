import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import * as Web3 from 'web3';
import { ethers } from "ethers";


declare var $: any;
declare let require: any;
declare let window: any;

@Injectable({
    providedIn: 'root'
  })
  export class AssetsService {
    metamask: any;
  hasMetaMask: boolean;
  balance: any;
  account: any;
  displayedData: string;
  metaInfo: { account: any; accounts: any; displayedData: string; balance: any; hasMetaMask: boolean; };
  abi = [
    "function issueToken(uint256,address,string,string,string)",
    "function startAuction(uint256,uint256,uint256,uint256,uint256,uint256)",
    "function placeBid(uint256,uint256)",
    "function endBid(uint256,uint256)",
    "function withdraw(uint256,uint256)",
    "function cancelAuction(uint256,uint256)"
  ];
  chainId = 77;
  testChainId = 56;
  contractAddress = '0x0B58e18b7EF3011Ce26B9cb2538030e2427e67Bf';
  issuanceResponse: any;

    constructor(public httpClient: HttpClient, public spinner: NgxSpinnerService) {
      console.log('tji', window.web3)
      if (typeof window.web3 !== 'undefined') {
        this.web3Provider = window.web3.currentProvider;
      } else {
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
   
      window.web3 = new Web3(this.web3Provider);
      if (window.ethereum.isMetaMask === true) {
        this.metamask = window.ethereum;
        this.hasMetaMask = true;
      } else {
        this.hasMetaMask = false;
      }
      this.getMetamaskInfo();
    }

  async getMetamaskInfo() {
    const accounts = await this.metamask.request({ method: 'eth_requestAccounts' });
    this.account = accounts[0];
    this.displayedData = this.account.substring(0, 8) + 'xxxxx' + this.account.slice(this.account.length - 8)
    const balance =  await this.metamask.request({"jsonrpc":"2.0", method: 'eth_getBalance', params:  [this.account] }).then(res => {
      this.balance =  window.web3.fromWei(res, 'ether');
    }) 
    this.metaInfo = {
      'account': this.account,
      'accounts': accounts,
      'displayedData': this.displayedData,
      'balance': this.balance,
      'hasMetaMask': this.hasMetaMask
    } 
  
    return this.metaInfo;
  }

    baseUrl = 'http://35.224.252.52:8080/v3';
    private web3Provider: any;
    api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';

    listing() {
      return this.httpClient.get(`${this.baseUrl}/assets/listings`);
    }

    issue(tokenId, assetName, symbol) {
      let yFace = new ethers.utils.Interface(this.abi);
      const data: string = yFace.encodeFunctionData("issueToken", [tokenId, this.account, 'empty string', assetName, symbol ]);
      const ethValue = "0.1"; // 0 BNB
      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        //gasPrice: '0x37E11D600', // customizable by user during MetaMask confirmation.
        //gas: '0x12C07', // customizable by user during MetaMask confirmation.
        to: this.contractAddress, // Required except during contract publications.
        from: this.metamask.selectedAddress, // must match user's active address.
        value: ethers.utils.parseEther(ethValue).toHexString(),
        data: data,
        chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
       // txHash is a hex string
    // As with any RPC call, it may throw an error
    console.log(transactionParameters);
      this.metamask.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
        console.log(txHash);
        this.issuanceResponse = txHash;
      }, (error: any) => {
        console.log('this is error ==>', error)
        this.issuanceResponse = error;
      });
      return this.issuanceResponse;
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
