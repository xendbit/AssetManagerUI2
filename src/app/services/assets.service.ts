import { Injectable, OnInit } from '@angular/core';
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
  export class AssetsService implements OnInit {
  metamask: any;
  hasMetaMask: boolean;
  balance: any;
  account: any;
  show: boolean;
  displayedData: string;
  metaInfo: { account: any; accounts: any; displayedData: string; balance: any; hasMetaMask: boolean; };
  abi = [
    "function issueToken(uint256,address,string,string,string)",
    "function startAuction(uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
    "function placeBid(uint256,uint256)",
    "function endBid(uint256,uint256)",
    "function withdraw(uint256,uint256)",
    "function cancelAuction(uint256,uint256)"
  ];
  chainId = 97;
  testChainId = 56;
  // contractAddress = '0x24738DAE29c0D0e26cDE5b1bC8503EB0E8D8662f';
  issuanceResponse: any;
  auctionResponse: string;
  bidResponse: string;
  contractAddress: any;
  currentBlock: any;
  withdrawResponse: string;

    constructor(public httpClient: HttpClient, public spinner: NgxSpinnerService) {
    
        this.metamask = window.ethereum;
        window.web3 = new Web3(this.web3Provider);
        this.getContractAddress().subscribe(data => {
          if (data['status'] === 'success') {
            this.contractAddress = data['data'];
          }
        })
    }

    ngOnInit() {
      if (typeof window.web3 !== 'undefined') {
        this.web3Provider = window.web3.currentProvider;
      } else {
        this.web3Provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
      }
      window.web3 = new Web3(this.web3Provider);
      this.getMetamaskInfo();
    }

    baseUrl = 'http://35.224.252.52:8080/v3';
    nifty = 'https://lb.xendbit.net/api/yasuke';
    private web3Provider: any;
    api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';
    nifty_api_key = 'U2FsdGVkX18k5itQROOzEotUtBOLK4apPBmljl1wphduEXLbXkP08TjP6EVNDq+QzEVSAVgWOD/WMCkV1WQZ9Uo/3JXBrjz2RVdgNQmZ5sU=';

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

  listing() {
    return this.httpClient.get(`${this.baseUrl}/assets/listings`);
  }

  saveIssuer(email: string, phone: any, firstname: string, lastname: string, middlename: string, blockchainAddress: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.post(`${this.nifty}/save-issuer/`, {
      "email": email,
      "phoneNumber": phone,
      "firstName": firstname, 
      "middleName": middlename,
      "lastName": lastname,
      "blockchainAddress": blockchainAddress
    },  {headers})
  }

  saveBuyer(email: string, phone: any, firstname: string, lastname: string,
    middlename: string, blockchainAddress: any, country: string, zipCode: any, state: string,
    city: string, street: string, houseNumber: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.post(`${this.nifty}/save-buyer/`, {
      "email": email,
      "phoneNumber": phone,
      "firstName": firstname, 
      "middleName": middlename,
      "lastName": lastname,
      "blockchainAddress": blockchainAddress,
      "country": country,
      "zipCode": zipCode,
      "state": state,
      "city": city,
      "street": street,
      "houseNumber": houseNumber
    },  {headers})
  }



  async issue(tokenId: number, assetName: any, symbol: any) {
    let yFace = new ethers.utils.Interface(this.abi);
    const data: string = yFace.encodeFunctionData("issueToken", [tokenId, this.account, 'empty string', assetName, symbol ]);
    const ethValue = "0"; // 0 BNB
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
    await this.metamask.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.issuanceResponse = {status: 'success', response: txHash};
    }, (error: any) => {
      console.log('this is error ==>', error)
      this.issuanceResponse = error;
    });
    return this.issuanceResponse;
  }

  async startAuction(tokenId: number, auctionId: number, startBlock: number, endBlock: number, currentBlock: number, sellNowPrice: string, minimumBid: string) {
    let snp: string = ethers.utils.parseEther(sellNowPrice).toHexString();
    let mb: string = ethers.utils.parseEther(minimumBid).toHexString();
    let yFace = new ethers.utils.Interface(this.abi);
    const data: string = yFace.encodeFunctionData("startAuction", [tokenId, auctionId, startBlock, endBlock, currentBlock, snp, mb ]);
    const ethValue = "0"; // 0 BNB
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
    await this.metamask.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.auctionResponse = txHash;
    }, (error: any) => {
      console.log('this is error ==>', error)
      this.auctionResponse = error;
    });
    return this.auctionResponse;
  }

  getCurrentBlock()  {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/get-block`, {headers})
  }

  async placeBid(tokenId: number, auctionId: number, bidAmount: any) {
    let yFace = new ethers.utils.Interface(this.abi);
    const data: string = yFace.encodeFunctionData("placeBid", [tokenId, auctionId ]);
    console.log('this is amount', String(bidAmount))
    const ethValue: string = String(bidAmount); // 0 BNB
    const transactionParameters = {
      nonce: '0x00',
      to: this.contractAddress,
      from: this.metamask.selectedAddress,
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: this.chainId,
    };
    await this.metamask.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.bidResponse = txHash;
    }, (error: any) => {
      this.bidResponse = error;
    });
    return this.bidResponse;
  }

  async endBid(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(this.abi);
    const data: string = yFace.encodeFunctionData("endBid", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
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
    await this.metamask.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.bidResponse = txHash;
    }, (error: any) => {
      this.auctionResponse = error;
    });
    return this.bidResponse;
  }

  getContractAddress() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/get-contract-address`, {headers})
  }

  listAuctionByTokenId(tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/list-auctions/by-token-id/${tokenId}?page=1&limit=200`, {headers}) 
  }

  getAuctionInfo(tokenId: number, auctionId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/get-auction-info/${tokenId}/${auctionId}`, {headers})    
  }

  async withdraw(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(this.abi);
    const data: string = yFace.encodeFunctionData("withdraw", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
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
    await this.metamask.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.withdrawResponse = txHash;
    }, (error: any) => {
      this.auctionResponse = error;
    });
    return this.withdrawResponse;
  }


  async cancelAuction(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(this.abi);
    const data: string = yFace.encodeFunctionData("cancelAuction", [tokenId, auctionId ]);
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
    await this.metamask.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.bidResponse = txHash;
    }, (error: any) => {
      this.auctionResponse = error;
    });
    return this.bidResponse;
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
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/list-tokens?page=1&limit=200`, {headers});
  }

  getOwnedShares(userId: number, tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/user/owned-shares/${userId}/${tokenId}`, {headers});
  }

  getAssetsByIssuerId(userId: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/assets/by-issuer/${userId}?page=${1}&limit=15`, {headers});
  }

  cancelOrder(id: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/assets/cancel-order/${id}`, {},  {headers})
  }

  issueToken(tokenId: number, medias: any, mediaType: any, dateCreated: any, category: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.post(`${this.nifty}/issue-token/`, {"tokenId": tokenId,
      "medias": medias,
      "keys": mediaType, 
      "dateIssued": dateCreated,
      "category": category
    },  {headers})
  }

  startAuctionNifty(auctionId: number, tokenId: number, startDate: number, endDate: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.post(`${this.nifty}/start-auction`, 
    {tokenId: tokenId,
      auctionId: auctionId,
      startDate: startDate,
      endDate: endDate
    },  {headers})
  }

  listToken() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/issue-token/`)
  }

  fetchOrderById(orderId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/assets/orders/${orderId}`, {headers});
  }

  getAssetsByOwnerId(userId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/list-tokens/by-owner/${userId}?page=${1}&limit=100`, {headers});
  }

  getAccountInfo() {
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
   

  getAssetsByTokenId(tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/get-token-info/${tokenId}`, {headers});
  }

  getWaletBalance(userId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/user/wallet-balance/${userId}`, {headers});
  }

  getIssuerStatus(walletAddress: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/is-issuer/${walletAddress}`, {headers});
  }

  getBuyerStatus(walletAddress: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.nifty_api_key);
    return this.httpClient.get(`${this.nifty}/buyer/by-blockchain-address/${walletAddress}`, {headers});
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

  ordersByBuyer(buyerId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/assets/orders/by-buyer/${buyerId}?page=1&limit=50`, {headers});
  }

  ordersBySeller(sellerId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.get(`${this.baseUrl}/assets/orders/by-seller/${sellerId}?page=1&limit=50`, {headers});
  }

  ordersByTokenId(tokenId: number) {
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

  changeMarket(tokenId: number) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/admin/conclude-primary-sales/${tokenId}`, {}, {headers});
  }


  showNotification(from, align, message, kind){
    this.show = true
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
        template: '<div id="closeModal" data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button  mat-button  type="button" aria-hidden="true" id="close_button" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title" style="font-family: Inter, serif;">{1}</span> ' +
          '<span data-notify="message"  style="font-family: Inter, serif;">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
    window.setTimeout(function() {
      $(".alert").fadeTo(500, 0).slideUp(500, function(){
          $(this).remove(); 
      });
  }, 4000);
  }

  dismissModal() {
   this.show = false;
  }

  showSpinner() {
    this.spinner.show();
  }

  stopSpinner() {
    this.spinner.hide();
  }
}
