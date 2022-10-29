import { UserActionsService } from 'src/app/core/services/userActions.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { ethers } from "ethers";
import  abi from 'src/assets/data/Yasuke.json';
import  detectEthereumProvider from '@metamask/detect-provider';
import { from } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { environment, networkChains, niftyKey, chainId, baseABI } from 'src/environments/environment';
import { FormatTypes, ParamType } from 'ethers/lib/utils';

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
  bidResponse: any;
  endbidResponse: any;
  auctionResponse: any;
  issuanceResponse: any;
  withdrawResponse: any;
  cancelResponse: any;
  blockResponse: any;
  chain: string;
  chainId = chainId;
  clickedOnMobile: boolean = false;
  connector: WalletConnect;
  userWallet: any;

  constructor(
    public httpClient: HttpClient,
    public platform: Platform,
    public userActions: UserActionsService) {
    this.getContractAddress().subscribe(data => {
      if (data['status'] === 'success') {
        this.contractAddress = data['data'];
      }
    })
    if (!localStorage.getItem('currentChain') || localStorage.getItem('currentChain') === undefined || localStorage.getItem('currentChain') === null) {
      this.chain = 'aurora';
    } else {
      this.chain = localStorage.getItem('currentChain');
    }
    this.checkChainChange();
  }

  createWalletForBuyer() {
    const ethers = require('ethers')
    const wallet = ethers.Wallet.createRandom()
    // console.log('address:', wallet.address)
    // console.log('mnemonic:', wallet.mnemonic.phrase)
    // console.log('privateKey:', wallet.privateKey)
    return {
      'buyerAddress': wallet.address,
      'privateKey': wallet.privateKey
    }
  }

  async checkChainChange() {
    this.userWallet = localStorage.getItem('userWallet');
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const _chainId = await window.ethereum.request({ method: 'eth_chainId' });
        let networkChain = parseInt(_chainId, 16);
        this.chainId = networkChain;
        localStorage.setItem('networkChain', networkChain.toString())
        const foundNetwork = networkChains.find((res: any) => res.chain === this.chainId);
        const systemChain = networkChains.find((res: any) => res.systemName === this.chain);
        if (foundNetwork === undefined) {
          this.userActions.errorToast("Your wallet is currently set to an unsupported blockchain network")
          // this.userActions.addSingle('global','warn', 'Wrong Chain', "Please make sure you are on either of the following chains: 'Binance Smart Chain', 'Harmony', 'Polygon' or 'Aurora' ")
        } else if (systemChain.name !== foundNetwork.name) {
          this.userActions.errorToast("Wrong chain. Your wallet is connected to " + foundNetwork.name);
          const chainIdHex = Number(systemChain.chain).toString(16);
          const params = [{
            chainId: '0x' + chainIdHex,
            chainName: systemChain.name,
            nativeCurrency: {
              name: systemChain.name,
              symbol: systemChain.currency,
              decimals: 18
            },
            rpcUrls: [systemChain.rpcUrl],
            blockExplorerUrls: [systemChain.explorer]
          }]

          window.ethereum.request({ method: 'wallet_addEthereumChain', params })
            .then(() => console.log('Success'))
            .catch((error: Error) => console.log("Error", error.message)
            )

        } else if (foundNetwork !== undefined && networkChain !== foundNetwork.chain) {
          this.userActions.errorToast("Please make sure your selected chain matches the chain on your wallet.")
        } else if (foundNetwork) {
          this.userActions.successToast(" Your wallet is connected to  " + foundNetwork.name)
        }

        window.ethereum.on('chainChanged', (chainId) => {
          if (networkChain === foundNetwork.chain) {
          } else {
            this.userActions.errorToast("Your wallet is currently set to an unsupported blockchain network ")
          }
          window.location.reload();
        })
      }
      if (this.userWallet === 'WalletConnect') {
        this.connector = new WalletConnect({
          bridge: "https://bridge.walletconnect.org", // Required
          qrcodeModal: QRCodeModal,
        });
        this.chainId = parseInt(localStorage.getItem('currentChainId'));
        localStorage.setItem('networkChain', this.chainId.toString())
        const foundNetwork = networkChains.find((res: any) => res.chain === this.chainId)
        const systemChain = networkChains.find((res: any) => res.chain === this.chainId);
        let networkChain = this.chainId;
        console.log('systemChain', systemChain, foundNetwork, this.chainId)
        if (foundNetwork === undefined) {
          this.userActions.errorToast("Your wallet is currently set to an unsupported blockchain network ")
          // this.connector.createSession({chainId: 56});

          // window.location.reload();
        } else if (foundNetwork) {
          this.userActions.successToast(" Your wallet is connected to  " + foundNetwork.name)
        }
        if (foundNetwork && systemChain.name !== foundNetwork.name) {
          console.log('got hereeee')
          this.userActions.errorToast("Wrong chain. Your wallet is connected to " + foundNetwork.name)
        }

        this.connector.on("session_update", (error, payload) => {
          if (error) {
            throw error;
          }

          // Get updated accounts and chainId
          const { accounts, chainId } = payload.params[0];
          let networkChain = parseInt(chainId, 16);
          console.log('acc', accounts, chainId, foundNetwork, networkChain, systemChain)
          this.chainId = chainId;
          if (foundNetwork !== undefined && networkChain !== foundNetwork.chain) {
            this.userActions.errorToast("Please make sure your selected chain matches the chain on your wallet.")
          } else if (foundNetwork) {
            this.userActions.successToast(" Your wallet is connected to  " + foundNetwork.name)
          }
          if (foundNetwork === undefined) {
            this.userActions.errorToast("Your wallet is currently set to an unsupported blockchain network ")
          }
          if (systemChain.name !== foundNetwork.name) {
            console.log('got hereeee')
            this.userActions.errorToast("Wrong chain. Your wallet is connected to " + foundNetwork.name)
          }
          window.location.reload();
        });
        this.connector.on("disconnect", (error, payload) => {
          if (error) {
            throw error;
          }
          this.disconnectFromWalletConnect();
        })
      }
    }
  }

  public openMetamask = async () => {
    const isOnMobileMetamask = localStorage.getItem("isOnMobileMetamask");
    if (this.platform.ANDROID) {
      if (isOnMobileMetamask === "true") {
        if (window.ethereum) {
          this.handleEthereum();
        } else {
          window.addEventListener('ethereum#initialized', this.handleEthereum, {
            once: true,
          });
          // If the event is not dispatched by the end of the timeout,
          // the user probably doesn't have MetaMask installed.
          setTimeout(this.handleEthereum, 3000); // 3 seconds
        }
      } else {
        localStorage.setItem('isOnMobileMetamask', 'true');
        window.location.href = "https://metamask.app.link/dapp/app.niftyrow.io";
      }
      // this.clickedOnMobile = true;
      // window.open("https://metamask.app.link/bxwkE8oF99", '_blank');
    }
    if (this.platform.IOS) {
      if (isOnMobileMetamask === "true") {
        if (window.ethereum) {
          this.handleEthereum();
        } else {
          window.addEventListener('ethereum#initialized', this.handleEthereum, {
            once: true,
          });
          setTimeout(this.handleEthereum, 3000); // 3 seconds
        }
      } else {
        localStorage.setItem('isOnMobileMetamask', 'true');
        window.location.href = "https://metamask.app.link/dapp/app.niftyrow.io";
      }
    }
    return from(detectEthereumProvider()).subscribe(async (provider) => {
        if (!provider) {
          // throw new Error('Please install MetaMask');
        }
        localStorage.removeItem('account');
        this.provider = provider;
        const accounts = await this.provider.request({
          method: "wallet_requestPermissions",
          params: [{
              eth_accounts: {}
          }]
      }).then(async () => {
        this.provider.request({
          method: 'eth_requestAccounts',
      })
      this.walletAddress = this.provider.selectedAddress;

      localStorage.setItem('account', this.provider.selectedAddress);
      localStorage.setItem('userWallet', 'Metamask');
      const systemChain = networkChains.find((res: any) => res.systemName === this.chain);
      const chainIdHex = Number(systemChain.chain).toString(16);
      const params = [{
        chainId: '0x' + chainIdHex,
        chainName: systemChain.name,
        nativeCurrency: {
          name: systemChain.name,
          symbol: systemChain.currency,
          decimals: 18
        },
        rpcUrls: [systemChain.rpcUrl],
        blockExplorerUrls: [systemChain.explorer]
      }]

      window.ethereum.request({ method: 'wallet_addEthereumChain', params })
        .then(() => console.log('Success'))
        .catch((error: Error) => console.log("Error", error.message)
        )
      return {
        account: this.walletAddress
      }
    })
      window.location.reload();
      });
  }

  public handleEthereum() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      console.log('Ethereum successfully detected!');
      // Access the decentralized web!
      return from(detectEthereumProvider()).subscribe(async (provider) => {
        if (!provider) {
          // throw new Error('Please install MetaMask');
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
      this.walletAddress = this.provider.selectedAddress;
      localStorage.setItem('userWallet', 'Metamask');
      localStorage.setItem('account', this.provider.selectedAddress);
      return {
        account: this.walletAddress
      }
    })
      window.location.reload();
      });
    } else {
      console.log('Please install MetaMask!');
    }
  }

  async getBlockCount(hash: any) {
    const { ethereum } = window;
    this.provider = new ethers.providers.Web3Provider(ethereum);
    let blockCount = 0;
    let numberOfBlocks = 5;
    this.blockResponse = {
      status: 'incomplete'
    }
    return new Promise((resolve, reject) => {
      try {
        this.provider.on('block', async (blockNumber) => {
          blockCount++;
          if (blockCount > numberOfBlocks) {
              this.provider.removeAllListeners('block');
              this.blockResponse = {
                status: 'complete'
              }
              const txReceipt = await this.provider.getTransactionReceipt(hash);
              if (txReceipt && txReceipt.blockNumber) {
                  this.provider.removeAllListeners('block');
                  // resolve(true);
              }
              resolve(this.blockResponse)
          }
        });
      } catch (e) {
        console.log('error', e)
        reject(e)
      }
    })
  }

  public getBalance() {
    const account = localStorage.getItem('account');
    return this.httpClient.get(`${environment.baseApiUrl}get-account-balance/${account}`)
  }

  public async checkConnection() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts[0];
  }

  disconnectFromClient() {
    localStorage.removeItem('userWallet');
    localStorage.removeItem('account');
    localStorage.removeItem('currentChainId');
    window.location.reload();
  }


  async tryWalletConnect() {
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });

    if (!this.connector.connected) {
      // create new session
      this.connector.createSession();
    }

    console.log('connector', this.connector)

    this.connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      this.chainId = chainId;
      this.walletAddress = accounts;
      localStorage.setItem('userWallet', 'WalletConnect')
      localStorage.setItem('account', this.walletAddress);
      localStorage.setItem('currentChainId', this.chainId.toString())
      window.location.reload();
    });

    this.connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
    })
  }

  disconnectFromWalletConnect() {
    if (this.connector) {
      this.connector.killSession();
    }
    localStorage.removeItem('userWallet');
    localStorage.removeItem('account');
    localStorage.removeItem('currentChainId');
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
    let yFace = new ethers.utils.Interface(abi.abi);
    this.contractAddress = localStorage.getItem('contractAddress');
    const data: string = yFace.encodeFunctionData("placeBid", [tokenId, auctionId ]);
    const ethValue: string = String(bidAmount); // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00',
          to: this.contractAddress,
          from: window.ethereum.selectedAddress,
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId,
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
          this.bidResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          this.bidResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.bidResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.bidResponse = data;
        });
      }
      return this.bidResponse;
    }
  }

  async endBid(tokenId: number, auctionId: number) {
    let yFace = new ethers.utils.Interface(baseABI);
    this.contractAddress = localStorage.getItem('contractAddress');
    const data: string = yFace.encodeFunctionData("endBid", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
          this.endbidResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          this.endbidResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.endbidResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.endbidResponse = data;
        });
      }
      return this.endbidResponse;
    }
  }

  async sellNow(tokenId: number, price: number) {
    let yFace = new ethers.utils.Interface(baseABI);
    console.log('price', price)
    // price = ethers.utils.parseEther(price).toHexString();
    this.contractAddress = localStorage.getItem('contractAddress');
    const data: string = yFace.encodeFunctionData("sellNow", [tokenId, price ]);
    const ethValue = "0"; // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
          this.endbidResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          this.endbidResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.endbidResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.endbidResponse = data;
        });
      }
      return this.endbidResponse;
    }
  }


  async bought(tokenId: number) {
    let yFace = new ethers.utils.Interface(baseABI);
    this.contractAddress = localStorage.getItem('contractAddress');
    const data: string = yFace.encodeFunctionData("bought", [tokenId ]);
    const ethValue = "0"; // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
          this.endbidResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          this.endbidResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.endbidResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.endbidResponse = data;
        });
      }
      return this.endbidResponse;
    }
  }

  getContractAddress() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', niftyKey);
    headers = headers.append('chain', this.chain);
    return this.httpClient.get(`${environment.baseApiUrl}get-contract-address`, {headers})
  }


  async issue(tokenId: number, assetName: any, symbol: any, account: string) {
    this.userWallet = localStorage.getItem('userWallet');
    let yFace = new ethers.utils.Interface(baseABI);
    // const lee = yFace.format(FormatTypes['minimal']);
    // console.log('caalled', yFace.format(FormatTypes['minimal']))
    // let iface = new ethers.utils.Interface(lee)
    this.contractAddress = localStorage.getItem('contractAddress')
    const data: string = yFace.encodeFunctionData("issueToken", [tokenId, account, 'empty string', assetName, symbol ]);
    const ethValue = "0"; // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters]}).then((txHash: string) => {
          this.issuanceResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          console.log('here', error)
          this.issuanceResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.issuanceResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.issuanceResponse = data;
        });
      }
      return this.issuanceResponse;
    }
  }

  async startAuction(tokenId: number, auctionId: number, startBlock: number, endBlock: number, currentBlock: number, sellNowPrice: string, minimumBid: string) {
    this.contractAddress = localStorage.getItem('contractAddress');
    let snp: string = ethers.utils.parseEther(sellNowPrice).toHexString();
    let mb: string = ethers.utils.parseEther(minimumBid).toHexString();
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("startAuction", [tokenId, auctionId, startBlock, endBlock, currentBlock, snp, mb ]);
    const ethValue = "0"; // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
          this.auctionResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          this.auctionResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.auctionResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.auctionResponse = data;
        });
      }
      return this.auctionResponse;
    }
  }

  async withdraw(tokenId: number, auctionId: number) {
    this.contractAddress = localStorage.getItem('contractAddress');
    let yFace = new ethers.utils.Interface(baseABI);
    const data: string = yFace.encodeFunctionData("withdraw", [tokenId, auctionId ]);
    const ethValue = "0"; // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
          this.withdrawResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          this.withdrawResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.withdrawResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.withdrawResponse = data;
        });
      }
      return this.withdrawResponse;
    }
  }

  async cancelAuction(tokenId: number, auctionId: number) {
    this.contractAddress = localStorage.getItem('contractAddress');
    let yFace = new ethers.utils.Interface(this.bidResponse);
    const data: string = yFace.encodeFunctionData("cancelAuction", [tokenId, auctionId ]);
    const ethValue = "0.1"; // 0 BNB
    if (this.userWallet !== null) {
      if (this.userWallet === 'Metamask') {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionParameters], }).then((txHash: string) => {
          this.cancelResponse = {status: 'success', response: txHash};
        }, (error: any) => {
          this.cancelResponse = error;
        });
      }
      if (this.userWallet === 'WalletConnect') {
        this.walletAddress = localStorage.getItem('account')
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          to: this.contractAddress, // Required except during contract publications.
          from:  this.walletAddress, // must match user's active address.
          value: ethers.utils.parseEther(ethValue).toHexString(),
          data: data,
          chainId: this.chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };
        await this.connector.sendTransaction(transactionParameters)
        .then((result) => {
          // Returns transaction id (hash)
          this.cancelResponse = {status: 'success', response: result};
        }, err => {
          console.error(err);
          const data = {
            status: 'error'
          }
          this.cancelResponse = data;
        });
      }
      return this.cancelResponse;
    }
  }

  getCurrentBlock()  {
    return this.httpClient.get(`${environment.baseApiUrl}get-block`, environment.headers)
  }


}
