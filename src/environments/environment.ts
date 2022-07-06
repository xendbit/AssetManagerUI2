// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { HttpHeaders } from '@angular/common/http';
import { AppEnvironment } from '../app/core/interfaces/app-environment.interface';


let apiKey = 'U2FsdGVkX18k5itQROOzEotUtBOLK4apPBmljl1wphduEXLbXkP08TjP6EVNDq+QzEVSAVgWOD/WMCkV1WQZ9Uo/3JXBrjz2RVdgNQmZ5sU=';
let demoBlockchainKey = "c7740e06-43f2-46cb-92e1-85841d6d2f72";
let ravePubKey = 'FLWPUBK-1d8566c17fd622e946c6652b20b30b12-X'
let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('Content-Type', 'application/json');
headers = headers.append('api-key', apiKey);

export const environment: AppEnvironment = {
  production: true,
  headers: headers,
  baseApiUrl: 'https://lb.xendbit.net/api/yasuke/',
  extraUrl: 'https://lb.xendbit.net/yasuke-server/',
  icoUrl: 'https://lb.xendbit.net/api/ico/whitelist/',
  security: {
    allowedOrigins: 'https://niftyrow.io/'
  }
};




export const networkChains = [ {
  name: 'Harmony Testnet',
  chain: 1666700000,
  rpcUrl: 'https://api.s0.b.hmny.io',
  currency: 'ONE',
  systemName: 'harmony',
  verifyLink: 'https://explorer.testnet.harmony.one/address/'
},
{
  name: "Binance Smart Chain Testnet",
  chain: 97,
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  currency: 'BNB',
  systemName: 'bsc',
  verifyLink: 'https://testnet.bscscan.com/token/'
},
{
  name: "Binance Smart Chain Testnet",
  chain: 56,
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  currency: 'BNB',
  systemName: 'bsc',
  verifyLink: 'https://testnet.bscscan.com/token/'
},
{
  name: "Polygon Testnet",
  chain: 80001,
  rpcUrl: 'https://rpc-mumbai.matic.today',
  currency: 'MATIC',
  systemName: 'polygon',
  verifyLink: 'https://mumbai.polygonscan.com/token/'
},
{
  name: "Aurora Testnet",
  chain: 1313161555,
  rpcUrl: 'https://testnet.aurora.dev/',
  currency: 'aETH',
  systemName: 'aurora',
  verifyLink: 'https://aurorascan.dev/token/'
},
{
  name: "Avalanche",
  chain: 43113,
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  currency: 'AVAX',
  systemName: 'avalanche',
  verifyLink: 'https://testnet.snowtrace.io/token/'
},
{
name: "Avalanche Mainnet",
chain: 43114,
rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
currency: 'AVAX',
systemName: 'avalanche',
verifyLink: 'https://testnet.snowtrace.io/token/'
}
]

export const rpcData = {
1666700000: 'https://api.s0.b.hmny.io',
97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
80001: 'https://rpc-mumbai.matic.today',
1313161555: 'https://testnet.aurora.dev/',
43113: 'https://api.avax-test.network/ext/bc/C/rpc'
}

export const baseABI = [
  "function issueToken(uint256,address,string,string,string)",
  "function startAuction(uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
  "function placeBid(uint256,uint256)",
  "function endBid(uint256,uint256)",
  "function withdraw(uint256,uint256)",
  "function cancelAuction(uint256,uint256)",
  "function sellNow(uint256, uint256)",
  "function bought(uint256)"
]

export const trial = [
  "function issueToken(uint256,address,string,string,string, bool)",
  "function startAuction(uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
  "function placeBid(uint256,uint256)",
  "function endBid(uint256,uint256)",
  "function withdraw(uint256,uint256)",
  "function cancelAuction(uint256,uint256)",
  "function sellNow(uint256, uint256)",
  "function bought(uint256)"
]

export const chainId = 1666700000;
export const niftyKey = apiKey;
export const ravePublicKey = ravePubKey;
export const blockchainInfo = {
key: demoBlockchainKey,
url: "https://api.blockchain.com/v3/exchange"
};

export const cryptocompareInfo = {
url: "https://min-api.cryptocompare.com/data/price?"
}


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
