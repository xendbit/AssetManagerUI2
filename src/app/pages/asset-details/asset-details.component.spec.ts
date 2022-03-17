import { PaymentService } from './../../core/services/payment.service';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { testingRoutes } from 'src/test/mocks/routes.mock';

import { AssetDetailsComponent } from './asset-details.component';
import { FormsModule } from '@angular/forms';

describe('AssetDetailsComponent', () => {
  let component: AssetDetailsComponent;
  let fixture: ComponentFixture<AssetDetailsComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(testingRoutes),
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
      ],
      declarations: [ AssetDetailsComponent ],
      providers: [MetamaskService, MessageService,
        StripeService, PaymentService],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDetailsComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
