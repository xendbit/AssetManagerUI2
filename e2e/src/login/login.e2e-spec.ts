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
  //   browser.get('/login');
  //   login.email = 'mock'
  //   login.password = 'mock@gmail.com'
  //   // browser.pause()
  //   // expect(page.getTitleText()).toEqual('angular10App app is running!');
  //   element(by.css('.main-content button')).click()

  //   expect(await page.getTitleText()).toEqual('angular10App app is running!');
  // });


  it('should navigate to login', () => {
    expect(browser.getCurrentUrl()).toContain('/login')
  });

  it('should click on anchor tag (register) and navigate to /register', async () => {
    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investor.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investor.password);

    element(by.css('.main-content [href="/register"]')).click()

    await expect(browser.getCurrentUrl()).toContain('/register')
  });

  it('should login as an investor and navigate to /home', async () => {
    // browser.get('/login');

    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.investor.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.investor.password);

    element(by.css('.main-content button')).click()

    await expect(browser.getCurrentUrl()).toContain('/home')

  });

  it('should login as an issuer and navigate to /issuer-dashboard', async () => {
    // browser.get('/login');

    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.issuer.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.issuer.password);

    element(by.css('.main-content button')).click()

    await expect(browser.getCurrentUrl()).toContain('/issuer-dashboard')

  });

  it('should login as an admin and navigate to /admin-dashboard', async () => {
    // browser.get('/login');

    element(by.css('[name="email"]')).sendKeys(environment.loginCredential.admin.email);
    element(by.css('[name="password"]')).sendKeys(environment.loginCredential.admin.password);

    element(by.css('.main-content button')).click()

    await expect(browser.getCurrentUrl()).toContain('/admin-dashboard')

  });

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});
