import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { testingRoutes } from 'src/test/mocks/routes.mock';
import { MetamaskService } from '../../services/metamask.service';

import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(testingRoutes),
        HttpClientTestingModule,
        NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
      ],
      declarations: [ SliderComponent ],
      providers: [MetamaskService, MessageService,
        StripeService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
