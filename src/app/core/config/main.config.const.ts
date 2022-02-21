import { IMenuGroups } from '../components/footer/footer.interface';
import { IurlConfig, headerConfig } from '../interfaces/dynamicUrl.interface';
import * as footerData from 'src/assets/data/footer.json' 
import { HttpHeaders } from '@angular/common/http';

export const footerConfig: IMenuGroups [] = footerData;
let apiKey = 'U2FsdGVkX18k5itQROOzEotUtBOLK4apPBmljl1wphduEXLbXkP08TjP6EVNDq+QzEVSAVgWOD/WMCkV1WQZ9Uo/3JXBrjz2RVdgNQmZ5sU=';
let demoBlockchainKey = "c7740e06-43f2-46cb-92e1-85841d6d2f72";
let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('Content-Type', 'application/json');
headers = headers.append('api-key', apiKey);

export const baseUrl: IurlConfig = {
        headers:  headers,
        testUrl: 'http://35.224.252.52:8080/v3/config/getHeader',
        mainUrl: 'https://lb.xendbit.net/api/yasuke/',
        icoUrl: 'https://lb.xendbit.net/api/ico/whitelist/'
}

export const networkChains = [ { 
                name: 'Harmony Testnet',
                chain: 1666700000,
                rpcUrl: 'https://api.s0.b.hmny.io',
                currency: 'ONE',
                verifyLink: 'https://explorer.testnet.harmony.one/address/'              
        },
        {
                name: "Binance Smart Chain Testnet",
                chain: 97,
                rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
                currency: 'TBNB',
                verifyLink: 'https://testnet.bscscan.com/token/'
        },
        {
                name: "Polygon Testnet",
                chain: 80001,
                rpcUrl: 'https://rpc-mumbai.matic.today',
                currency: 'MATIC'
        },
        {
                name: "Aurora Testnet",
                chain: 1313161555,
                rpcUrl: 'https://testnet.aurora.dev/',
                currency: 'aETH',
                verifyLink: 'https://aurorascan.dev/token/'
        }
]

export const baseABI = [
        "function issueToken(uint256,address,string,string,string)",
        "function startAuction(uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
        "function placeBid(uint256,uint256)",
        "function endBid(uint256,uint256)",
        "function withdraw(uint256,uint256)",
        "function cancelAuction(uint256,uint256)"
]
export const chainId = 1666700000;
export const niftyKey = apiKey;
export const blockchainInfo = {
        key: demoBlockchainKey,
        url: "https://api.blockchain.com/v3/exchange"
};
