import { ViewBuyOrders } from './view-buy-order.po';
import { browser, protractor, element, by } from 'protractor';
import { TestMockData } from '../../../src/app/test-mock-data';

describe('Admin View Buy Orders', () => {
  let buyOrders: ViewBuyOrders;

  beforeEach(async() => {
    buyOrders = new ViewBuyOrders();    
    await browser.get("/login");
  });

  it('admin should be able to log in and navigate to my orders page which has a tabs element and a tab named buy order', async () =>
  {
    const getLoginButton = await buyOrders.findLoginButton();
    buyOrders.enterEmail(TestMockData.adminLogin.email);
    browser.driver.sleep(100);
    buyOrders.enterPassword(TestMockData.adminLogin.password);
    browser.driver.sleep(100);
    browser.driver.sleep(400);
    await getLoginButton.click();
    browser.driver.sleep(5000);
    browser.get("/orders");
    browser.driver.sleep(5000);
    expect(buyOrders.getTextByCss('.text-uppercase.font-weight-light')).toContain('MY ORDERS');
    expect(buyOrders.getTextByCss('mat-tab-group')).toBeTruthy();
    expect(buyOrders.getTextByCss('.mat-tab-label-content')).toContain('Buy Order');
  });

  // it('should be directed to the my orders with tabs and a tab named buy order', async () =>
  // {
  //   browser.driver.sleep(5000);
  //   expect(buyOrders.getTextByCss('.text-uppercase.font-weight-light')).toContain('MY ORDERS');
  // });

})