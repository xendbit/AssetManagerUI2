import { MetamaskService } from './core/services/metamask.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { MainService } from './core/services/main.service';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { AppController } from './app.controller';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends AppController implements OnInit {
  navButtons: any;
  headerInfo: any;
  footerInfo: any;
  showHeader: any;
  account: string;
  display: boolean = false;
  displayRegister: boolean = false;
  SPINNER: SPINNER = SPINNER.threeBounce
  @Output() changeNotify: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router,
              private ngxService: NgxUiLoaderService,
              private route: ActivatedRoute,  private spinner: NgxSpinnerService,
              private titleService: Title, public mainService: MainService, public metamaskService: MetamaskService) {
    super();
  }

  ngOnInit(): void {
    this.ngxService.start()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.route.firstChild.snapshot.data['showHeader'];
      }
    });
    this.mainService.getLanding().subscribe(res => {

    });
    this.mainService.getNavButtons().subscribe(res => {
      this.navButtons = res;
    });
    this.mainService.getHeader().subscribe(res => {
      this.headerInfo = res;
    })
    this.mainService.getFooter().subscribe(res => {
      this.footerInfo = res;
    })
    // this.spinner.show();
    this.setBrowserTabTitle();
    const account = localStorage.getItem('account');
    if (account) {
      this.mainService.fetchAssetsByOwnerId(account, 1, 100);
    }
    this.mainService.fetchOnlyApproved(1, 100);
    this.mainService.fetchBlogPost();
    this.ngxService.stop();
    // this.spinner.hide();
    this.changeLogo();
  }

  private setBrowserTabTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => this.getRouteFirstChild(route)),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
    ).subscribe(event => this.titleService.setTitle(this.buildTitle(event['title'])));
  }

  private getRouteFirstChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  private buildTitle(pageTitle: string): string {
    if (pageTitle && pageTitle !== this.trans.home) {
      return [pageTitle, this.config.appTitle].join(this.config.browserTabTitleDelimiter);
    }

    return this.config.appTitle;
  }

  changeLogo() {
    const darkState = localStorage.getItem('dark-mode');
    if (darkState === 	'{"darkMode":false}') {
      this.footerInfo.logoPath = '/assets/img/NiftyRow-logo.png';
    } else {
      this.footerInfo.logoPath = '/assets/img/NiftyRow-logo-dark.png';
    }
  }

  listenToToggle(e: any) {
    if (e === true) {
      this.display = true;
      this.displayRegister = false
    } else {
      this.display = false
    }
  }

  listenToRegister(e: any) {
    this.displayRegister = true;
    if (e === true) {
      this.displayRegister = true;
      this.display = false;
    } else {
      this.displayRegister = false
    }
  }

  listenToLogin(e: any) {
    if (e === true) {
      this.display = true;
      this.displayRegister = false
    } else {
      this.display = false
    }
  }

}
