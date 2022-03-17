import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { MetamaskService } from './core/services/metamask.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DummyHomeComponent } from '../test/components/dummy-home.component';
import { DummyLoginComponent } from '../test/components/dummy-login.component';
import { DummySearchComponent } from '../test/components/dummy-search.component';
import { testingRoutes } from '../test/mocks/routes.mock';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { appConfig } from './core/config/app-config.const';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let titleService: Title;
  let router: Router;
  let route: ActivatedRoute;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(testingRoutes),
        HttpClientTestingModule,
        NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
      ],
      declarations: [
        AppComponent,
        DummyHomeComponent,
        DummySearchComponent,
        DummyLoginComponent
      ],
      providers: [Title, MetamaskService, MessageService,
      StripeService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    titleService = TestBed.get(Title);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });


  it('should create the app', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set the browser tab title', () => {
      router.navigate(['/search']).then(() => {
        const currTitle = titleService.getTitle();
        const expectedTitle = `Search${appConfig.browserTabTitleDelimiter}${appConfig.appTitle}`;

        expect(currTitle).toEqual(expectedTitle);
      });
    });

    it('should set the browser tab title as the application title', () => {
      router.navigate(['/']).then(() => {
        const currTitle = titleService.getTitle();
        const expectedTitle = `${appConfig.appTitle}`;

        expect(currTitle).toEqual(expectedTitle);
      });
    });
  });
});
