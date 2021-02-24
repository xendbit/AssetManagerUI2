import { HomeScreen } from './home-screen.po';
import { environment } from '../../../src/environments/environment';
import { browser, by, element, logging, until } from 'protractor';

describe('Home Screen Present test', () => {
  let homeScreen: HomeScreen;

  beforeEach(async() => {
    homeScreen = new HomeScreen();
    await browser.get("/home");
  });

  it('should navigate to /home page confirm screen is present', async () => {
    browser.driver.sleep(3000);
    await expect(browser.getCurrentUrl()).toContain('/home');
    browser.driver.sleep(3000);
    await expect(homeScreen.getTextByCss('.text-uppercase.font-weight-light')).toContain('NEW LISTINGS');
  });

});
