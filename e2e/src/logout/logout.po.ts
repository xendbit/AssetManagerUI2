import {PageObject} from '../helper';
import { element, by } from 'protractor';
export class Logout extends PageObject{

  enterEmail = str => this.enterWordsId("email", str);

  enterPassword = str => this.enterWordsId("password", str);

  getLoginButton = () => this.getFirstElement("generic-login .login-btn button");

  // getLogoutButton = () => this.getLastElement(".nav-link.text-nowrap.mr-3");
  getLogoutButton = () => this.getLastElement(".nav-item.position-static.dropdown.dropdown-delay.ng-star-inserted");

  findLoginButton = () => this.getFirstElement("button");

  getHomePageElement = () => this.getFirstElement("page-home");

}
