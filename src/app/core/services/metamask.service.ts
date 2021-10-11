import { Injectable} from '@angular/core';
import { ethers } from "ethers";
declare const window: any;


@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  window:any;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  walletAddress: string;
  walletBalance: string;

  constructor() { }

  public openMetamask = async () => {
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
    this.walletAddress = await this.signer.getAddress();
    this.signer.getBalance().then((balance) => {
      // convert a currency unit from wei to ether
      this.walletBalance =  ethers.utils.formatEther(balance)
      console.log(`balance: ${this.walletBalance} ETH`)
     })
  }

}
