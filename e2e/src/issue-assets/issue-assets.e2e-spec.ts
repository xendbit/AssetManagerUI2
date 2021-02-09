import { environment } from '../../../src/environments/environment';
import { browser, by, element, logging, until } from 'protractor';
import { pathToFileURL } from 'url';
var path = require('path');

describe('IssueAssets e2e test', () => {
  function generateRandomTitle(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
      return result;
  }
 
  // console.log(generateRandomTitle(5));

  beforeEach(() => {
    browser.get('/login');
  });

  xit('should login & navigate to /issue and issue an asset', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.issuer.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.issuer.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/issue');
      element(by.css('[name="artTitle"]')).sendKeys(generateRandomTitle(8));
      element(by.css('[name="artistName"]')).sendKeys('john TS');
      element(by.css('[name="symbol"]')).sendKeys(generateRandomTitle(8));
      element(by.css('[name="description"]')).sendKeys('test script');
      element(by.css('[name="totalSupply"]')).sendKeys(10);
      element(by.css('[name="issuingPrice"]')).sendKeys(10);
      element(by.css('[name="availableShares"]')).sendKeys(10);
      const absolutePath = path.resolve(__dirname, '../../../src/assets/img/nse.png');
      console.log('absolutePath :>> ', absolutePath);
      element(by.css('input[type=file]')).sendKeys(absolutePath);
      element.all(by.css('button')).get(0).click().then(()=> {
        browser.waitForAngular()
        
        browser.getCurrentUrl().then((d)=> {
          expect(d.split('/')[d.split('/').length-1]).toBe('issuer-dashboard')
        })
      })
    })
  });

  it('should login & successfully load issue-asset page', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.issuer.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.issuer.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/issue');
      
      browser.getCurrentUrl().then((d)=> {
        expect(d.split('/')[d.split('/').length-1]).toBe('issue')
      })
      expect(element(by.css('.card h4')).getText()).toContain('Issue Asset')
    })
  });
});
