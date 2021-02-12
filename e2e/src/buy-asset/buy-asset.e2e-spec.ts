import { environment } from '../../../src/environments/environment';
import { browser, by, element, logging, until } from 'protractor';
var path = require('path');

describe('BuyAsset e2e test', () => {
  beforeEach(() => {
    browser.get('/login');
  });

  it('should login as an investor & successfully load buy-asset page', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investor.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investor.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/fund');
      
      browser.getCurrentUrl().then((d)=> {
        expect(d.split('/')[d.split('/').length-1]).toBe('fund')
      })
      expect(element.all(by.css('#container_home b')).get(0).getText()).toContain('Account Number')
    })
  });
});
