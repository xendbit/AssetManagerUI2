import {PageObject} from '../helper';
import { element, by } from 'protractor';
export class ViewBuyOrders extends PageObject{

  enterEmail = str => this.enterWordsId("email", str);

  enterPassword = str => this.enterWordsId("password", str);

  getLoginButton = () => this.getFirstElement("generic-login .login-btn button");

  findLoginButton = () => this.getFirstElement("button");

  getHomePageElement = () => this.getFirstElement("page-home");
}
