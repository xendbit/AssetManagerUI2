import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { testingRoutes } from 'src/test/mocks/routes.mock';

import { MainService } from './main.service';
import { MetamaskService } from './metamask.service';

describe('MainService', () => {
  let service: MainService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => { TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes(testingRoutes),
      HttpClientTestingModule,
      HttpClientModule,
      NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
    ],
    providers: [MetamaskService, MessageService,
      StripeService],
  });
  httpClient = TestBed.get(HttpClient);
  httpTestingController = TestBed.get(HttpTestingController);
  service = TestBed.inject(MainService);
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
