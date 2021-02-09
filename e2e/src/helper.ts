import * as request from 'request';
import { browser, by, element, ElementFinder, $ } from 'protractor';
// import {LocalStorageHelper} from '../helpers/storage.helper'

export class PageObject {
    page: string = null;
    pageElement: ElementFinder = null;
    constructor(page:string = null){
        if(page){
            this.page = page;
            this.pageElement = element(by.css(page)).first();
        }
    }
    getElementByCss(_selector) {
        return element.all(by.css(_selector));
    }

    getText(_selector): ElementFinder {
        return element(by.css(_selector))
    }
    async goTo(_url){
        const capabilities = await browser.getCapabilities();
        const browserName = capabilities.get('browserName');
        if (browserName) {
            return browser.get(_url);
        }
        return Promise.resolve();

    }
    getFirstElement(_selector){
      return element.all(by.css(_selector)).first();
    }
    getLastElement(_selector){
        return element.all(by.css(_selector)).last();
      }
    getTagName(_selector){
        return element.all(by.tagName(_selector));
      }
    clickElement(_element: ElementFinder){
      return browser.actions().mouseMove(_element).click();
    }
    getElementByPartialText(_partialText): ElementFinder {
        return element.all(by.partialButtonText(_partialText)).first();
    }

    enterWords(_css, _word): any {
        return element(by.css(_css)).sendKeys(_word);
    }

    enterWordsId(_id, _word): any {
        return element(by.id(_id)).sendKeys(_word);
    }
    getPageTitle(pageName) {
        return  $(pageName)
            .$('ion-header')
            .$('ion-navbar')
            .$('ion-title')
            .$('.toolbar-title').getText();
    }
    // saveToLocalStorage(key, value){
    //     return LocalStorageHelper.setValue(key, value);
    // }
    // clearLocalStorage(){
    //     return LocalStorageHelper.clear();
    // }
    isCurrentPage = async(page: string = null) => {
        const currentPage = page || this.page;
        if (!currentPage){
            throw new Error("No Page Specified")
        }
        const displayedPage: ElementFinder = this.getFirstElement(currentPage);
        return await displayedPage.isPresent();
    }
    waitForElement = (selector) => {
        return browser.driver.wait(browser.isElementPresent.bind(browser.driver, selector), 10000 /* Timeout. */);
    };

    fetchConfig = () =>
    {
      const options = {
        method: 'GET',
        url: 'https://instantcheckout.app/wp-json/icapp/v1/settings/appconfig',
        headers:
        {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvaW5zdGFudGNoZWNrb3V0LmFwcCIsImlhdCI6MTU4NzExNjY3NSwibmJmIjoxNTg3MTE2Njc1LCJleHAiOjE1ODc3MjE0NzUsImRhdGEiOnsidXNlciI6eyJpZCI6IjQ5In19fQ.5gdRzpJbQLFgYzpT6JSfLvGvL-E1DG_CSjdNJPvTRFM',
            'Content-Type':'application/json',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
        }
      };
      return new Promise((resolve, reject) =>
      {
        try
        {
          request(options, (error: any, _response: any, body: string) =>
          {
            if (error)
            {
              reject(error);
            }
            else
            {
              resolve(JSON.parse(body));
            }
          })
        }
        catch (err)
        {
          reject(err);
        }
      })

    }

    getCurrentTabTitle = () =>
    {
      return element.all(by.css('a[aria-selected="true"] > .tab-button-text')).first().getText();
    }

    getTabButton = (tabindex: number) =>
    {
      return element(by.id(`tab-t0-${tabindex}`));
    }

    getTextByCss(css): Promise<string> {
        return element(by.css(css)).getText() as Promise<string>;
    }

}


