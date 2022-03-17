import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { testingRoutes } from 'src/test/mocks/routes.mock';
import { MetamaskService } from '../../services/metamask.service';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(testingRoutes),
        HttpClientTestingModule,
        NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
      ],
      declarations: [ FooterComponent ],
      providers: [MetamaskService, MessageService,
        StripeService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
