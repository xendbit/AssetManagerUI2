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

  it('should login as an investor, navigate to /viewAsset page click on "BUY ASSET" button, and subsequently cancel the order', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investorZeroBal.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investorZeroBal.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/myAssets');

      await element.all(by.css('#container_home .container-fluid')).get(1).element(by.css('mat-card')).click().then(()=> {
        browser.waitForAngular()

        element(by.css('[name="amount"]')).sendKeys(1);
        element(by.css('form button')).click()
        browser.sleep(1000)
        const button = browser.wait(until.elementLocated(by.css('.modal-footer button')), 10000);
        button.click();
        browser.sleep(1000)
        element.all(by.css('.modal-header h5')).get(0).isDisplayed().then((cancelBtn)=> {
          expect(cancelBtn).toBe(false)
        })
      })
    })
  });

  xit('should login as an investor, navigate to /viewAsset page click on "BUY ASSET" button, and show insufficient balance notification', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investorZeroBal.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investorZeroBal.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/myAssets');

      await element.all(by.css('#container_home .container-fluid')).get(1).element(by.css('mat-card')).click().then(()=> {
        browser.waitForAngular()

        element(by.css('[name="amount"]')).sendKeys(1);
        element(by.css('form button')).click()
        browser.sleep(1000)
        element.all(by.css('.modal-footer button')).get(1).click()
        // const button = browser.wait(until.elementLocated(by.css('.modal-footer button')), 10000);
        // button.click();
        // element.all(by.css('.modal-footer button')).get(0).click()
        expect(element.all(by.css('[data-notify="container"] span')).get(1).getText()).toContain('You currently do not have enough in your account balance to purchase this asset')
      })
    })
  });

  xit('should login as an investor, navigate to /viewAsset page and buy an asset with sufficient balance', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investor.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investor.password);
    element(by.css('.main-content button')).click().then(async ()=> {
      browser.waitForAngular()
      browser.get('/myAssets');

      let index = await getLeastPriceIndex();

      await element.all(by.css('#container_home .container-fluid')).get(1).$$('mat-card').get(index).click().then(()=> {
        browser.waitForAngular()

        element(by.css('[name="amount"]')).sendKeys(1);
        element(by.css('form button')).click()
        
        browser.sleep(1000)
        element.all(by.css('.modal-footer button')).get(1).click().then(()=> {
          browser.waitForAngular()

          browser.getCurrentUrl().then((d)=> {
            expect(d.split('/')[d.split('/').length-1]).toBe('home')
            expect(element.all(by.css('[data-notify="container"] span')).get(1).getText()).toContain('Asset has been bought successfully')
            browser.sleep(10000)
          })
  
        })
      })
    })
  });

});

async function getLeastPriceIndex() {
  let allPrices = [];

  await element.all(by.css('#container_home .container-fluid')).get(1).$$('mat-card p').map((card, i) => {
    card.getText().then(d => {
      if (d.includes('$')) {
        allPrices.push(parseInt(d.split('$')[1]));
      }
    });
  });
  let leastPrice = [...allPrices].sort(function (a, b) { return a - b; })[0];
  let leastPriceIndex = allPrices.indexOf(leastPrice);
  return leastPriceIndex
}

