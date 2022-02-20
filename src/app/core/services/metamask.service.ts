import { UserActionsService } from 'src/app/core/services/userActions.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { ethers } from "ethers";
import { baseABI, baseUrl, chainId, niftyKey} from '../config/main.config.const';
import  detectEthereumProvider from '@metamask/detect-provider';
import { from } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  window:any;
  provider: any;
  signer: ethers.providers.JsonRpcSigner;
  walletAddress: string;
  walletBalance: number;
  contractAddress: string;
  bidResponse: string;
  endbidResponse: string;
  auctionResponse: string;
  issuanceResponse: any;
  withdrawResponse: string;
  cancelResponse: string;
  chain: string;

  constructor(public httpClient: HttpClient, public platform: Platform, public userActions: UserActionsService) {
    this.getContractAddress().subscribe(data => {
      if (data['status'] === 'success') {
        this.contractAddress = data['data'];
      }
    }) 
    if (!localStorage.getItem('currentChain') || localStorage.getItem('currentChain') === undefined || localStorage.getItem('currentChain') === null) {
      this.chain = 'harmony';
    } else {
      this.chain = localStorage.getItem('currentChain');
    }
    this.checkChainChange();
  }


  async checkChainChange() {
    const _chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('this is chain', parseInt(_chainId, 16))
    let networkChain = parseInt(_chainId, 16);
    if (networkChain === 1666700000 || networkChain === 97) {
    } else {
      this.userActions.addSingle('warn', 'Wrong Chain', "Please make sure you are on either of the following chains: 'Binance Smart Chain', 'Harmony', 'Polygon' or 'Aurora' ")
    }
    window.ethereum.on('chainChanged', (chainId) => { 
      if (networkChain === 1666700000 || networkChain === 97) {
      } else {
        this.userActions.addSingle('warn', 'Wrong Chain', "Please make sure you are on either of the following chains: 'Binance Smart Chain', 'Harmony', 'Polygon' or 'Aurora' ")
      }
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // Metamask recommends reloading the page unless you have good reason not to.
      window.location.reload();
    })
  }

  public openMetamask = async () => {
    if (this.platform.ANDROID) {
      window.location.href = "https://metamask.app.link";
      // window.open("https://metamask.app.link/bxwkE8oF99", '_blank');
    }
    if (this.platform.IOS) {
      window.location.href = "https://apps.apple.com/us/app/metamask-blockchain-wallet/";
    }
    return from(detectEthereumProvider()).subscribe(async (provider) => {
        if (!provider) {
          // throw new Error('Please install MetaMask');
          console.log('not metamask');
        }
        localStorage.removeItem('account');
        this.provider = provider;
        const accounts = await this.provider.request({
          method: "wallet_requestPermissions",
          params: [{
              eth_accounts: {}
          }]
      }).then(() => {
        this.provider.request({
          method: 'eth_requestAccounts',
      })
      this.walletAddress = this.provider.selectedAddress
      localStorage.setItem('account', this.provider.selectedAddress);
      return {
        account: this.walletAddress
      }
    })
      window.location.reload();
      });
    // this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await this.provider.send("eth_requestAccounts", []);
    // this.signer = this.provider.getSigner();
    // localStorage.removeItem('account');
    // this.walletAddress = await this.signer.getAddress();
    // if (window.ethereum && window.ethereum.isMetaMask) {
    //   console.log('here')
    // }
    // this.signer.getBalance().then((balance) => {
    //   this.walletBalance =  parseInt(ethers.utils.formatEther(balance))
    //  });
    //  localStorage.setItem('account', window.ethereum.selectedAddress)
    // return {
    //   account: this.walletAddress,
    //   balance: this.walletBalance
    // }
  }

  public getBalance() {
    const account = localStorage.getItem('account');
    return this.httpClient.get(`${baseUrl.mainUrl}get-account-balance/${account}`)
  }

  public async checkConnection() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts[0];
  }

  disconnectFromClient() {
    localStorage.removeItem('account');
    window.location.reload();
  }

  changed(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== this.walletAddress) {
      this.walletAddress = accounts[0];
      // Do any other work!
    }
  }

  async placeBid(tokenId: number, auctionId: number, bidAmount: any) {
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("placeBid", [tokenId, auctionId ]);
    console.log('this is amount', String(bidAmount))
    const ethValue: string = String(bidAmount); // 0 BNB
    const transactionParameters = {
      nonce: '0x00',
      to: this.contractAddress,
      from: window.ethereum.selectedAddress,
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId,
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.bidResponse = txHash;
    }, (error: any) => {
      this.bidResponse = error;
    });
    return this.bidResponse;
  }

  async endBid(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("endBid", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.endbidResponse = txHash;
    }, (error: any) => {
      this.endbidResponse = error;
    });
    return this.endbidResponse;
  }

  getContractAddress() {
    let headers: HttpHeaders = new HttpHeaders();
    // let chain = localStorage.getItem('currentChain');
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    // headers = headers.append('chain', chain);
    return this.httpClient.get(`${baseUrl.mainUrl}get-contract-address`, {headers})
  }

  async issue(tokenId: number, assetName: any, symbol: any, account: string) {
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("issueToken", [tokenId, account, 'empty string', assetName, symbol ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
      // txHash is a hex string
  // As with any RPC call, it may throw an error
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
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
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("startAuction", [tokenId, auctionId, startBlock, endBlock, currentBlock, snp, mb ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.auctionResponse = txHash;
    }, (error: any) => {
      console.log('this is error ==>', error)
      this.auctionResponse = error;
    });
    return this.auctionResponse;
  }

  async withdraw(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("withdraw", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.withdrawResponse = txHash;
    }, (error: any) => {
      this.withdrawResponse = error;
    });
    return this.withdrawResponse;
  }

  async cancelAuction(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(this.bidResponse);
    const data: string = yFace.encodeFunctionData("cancelAuction", [tokenId, auctionId ]);
    const ethValue = "0.1"; // 0 BNB
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      to: this.contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: ethers.utils.parseEther(ethValue).toHexString(),
      data: data,
      chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
      this.cancelResponse = txHash;
    }, (error: any) => {
      this.cancelResponse = error;
    });
    return this.cancelResponse;
  }

  getCurrentBlock()  {
    return this.httpClient.get(`${baseUrl.mainUrl}/get-block`, baseUrl.headers)
  }



}
