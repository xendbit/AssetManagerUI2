import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { testingRoutes } from 'src/test/mocks/routes.mock';
import { MetamaskService } from './metamask.service';

import { UserActionsService } from './userActions.service';

describe('UserActionsService', () => {
  let service: UserActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(testingRoutes),
        HttpClientTestingModule,
        NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
      ],
      providers: [MetamaskService, MessageService,
        StripeService],
    });
    service = TestBed.inject(UserActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
