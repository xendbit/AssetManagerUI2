import { AppPage } from '../app.po';
import { environment } from '../../../src/environments/environment';
import { browser, by, element, logging, until } from 'protractor';

describe('ViewAssets e2e test', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    browser.get('/login');
  });

  it('should login as an investor & from My Assets page, navigate to /viewAsset page and show "SELL ASSET" button', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investor.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investor.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/myAssets');

      // element.all(by.css('#container_home .container-fluid')).get(1).element(by.css('mat-card')).getText().then((v)=> console.log('vvvvv :>> ', v))
      // browser.waitForAngular()
      await element.all(by.css('#container_home .container-fluid')).get(0).element(by.css('mat-card')).click().then(()=> {
        browser.waitForAngular()
        browser.getCurrentUrl().then((d)=> {
          expect(d.split('/')[d.split('/').length-1]).toBe('viewAsset')
          expect(element(by.css('form button')).getText()).toContain('SELL ASSET')
        })
      })
    })
  });

  it('should login as an investor & from My Assets page, navigate to /viewAsset page and show "BUY ASSET" button', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investor.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investor.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/myAssets');

      await element.all(by.css('#container_home .container-fluid')).get(1).element(by.css('mat-card')).click().then(()=> {
        browser.waitForAngular()
        browser.getCurrentUrl().then((d)=> {
          expect(d.split('/')[d.split('/').length-1]).toBe('viewAsset')
          expect(element(by.css('form button')).getText()).toContain('BUY ASSET')
        })
      })
    })
  });

  it('should login as an admin & from Approve page, navigate to /viewAsset page and show "APPROVE" & "DECLINE" button', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.admin.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.admin.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/approve');

      await element(by.css('mat-card button')).click().then(()=> {
        browser.waitForAngular()
        browser.getCurrentUrl().then((d)=> {
          expect(d.split('/')[d.split('/').length-1]).toBe('viewAsset')
          expect(element.all(by.css('button')).get(0).getText()).toContain('APPROVE')
          expect(element.all(by.css('button')).get(1).getText()).toContain('DECLINE')
        })
      })
    })
  });
});
