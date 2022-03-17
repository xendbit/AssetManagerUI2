import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxStripeModule } from 'ngx-stripe';
import { testingRoutes } from 'src/test/mocks/routes.mock';

import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(testingRoutes),
        HttpClientTestingModule,
        HttpClientModule,
        NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
      ],
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
