import { AppPage } from '../app.po';
import { environment } from '../../../src/environments/environment';
import { browser, by, element, logging, until } from 'protractor';

describe('Login test', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    browser.get('/login');
  });

  // it('should display home message', () => {
  //   page.navigateTo();
  //   expect(page.clickThePage).toBeTruthy();
  // });

  // it('should navigate to login', async function() {
  //   browser.get('/sell');
  //   login.email = 'mock'
  //   login.password = 'mock@gmail.com'
  //   // browser.pause()
  //   // expect(page.getTitleText()).toEqual('angular10App app is running!');
  //   element(by.css('.main-content button')).click()

  //   expect(await page.getTitleText()).toEqual('angular10App app is running!');
  // });


  it('should login & navigate to /sell and display assets', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.issuer.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.issuer.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/sell');
      browser.getCurrentUrl().then((d)=> {
        console.log('browser.getCurrentUrl() :>> ', d);
        expect(d.split('/')[d.split('/').length-1]).toBe('sell')
      })
      expect(element(by.css('.main-content mat-card h4')).getText()).toContain('Details of Art')

      // expect(browser.getCurrentUrl()).toContain('/sell')

    })
  });

  it('should login & navigate to /sell, click on View Asset btn and navigate to /viewAsset', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.issuer.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.issuer.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/sell');
      
      await element.all(by.css('.main-content mat-card button')).get(0).click().then(()=> {
        browser.waitForAngular()
        expect(browser.getCurrentUrl()).toContain('/viewAsset')
      })
    })
  });
});
