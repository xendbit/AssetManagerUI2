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
import { IArtwork, IAuction } from 'src/app/core/components/slider/presentation.interface';
import { AuctionService } from 'src/app/core/services/auction.service';

describe('AssetDetailsComponent', () => {
  let component: AssetDetailsComponent;
  let fixture: ComponentFixture<AssetDetailsComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let auctionService: jasmine.SpyObj<AuctionService>;
  const artwork: IArtwork = {"id": "","category": "musicRight","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "",
  "collections": [],"type": ""},"featuredImage": {"media": "","mediaType": 0},"isBidding": true, "gallery": [{ "media": "",
  "mediaType": 0 }], "description": "", "price": 0, "currency": "", "dateIssued": 0, "hasActiveAuction": true, "lastAuctionId": 0, "likes": 0, "assetType": "digital", "sold": false, "name": "", "tokenId": 0, "symbol": "", "type": ""};
  const auction: IAuction = {"auctionId": 0,"cancelled": false,"currentBlock": 0,"startBlock": 0,"endBlock": 0,"highestBid": 0,"highestBidder": "", "bids": [{bidder: "none", bid: 0, auctionId: 0}],"isActive": true,
  "owner": "","sellNowPrice": 0,"title": "","currentBid": 0,"currency": "","endDate": new Date(),"startDate": new Date(),"minimumBid": 0,"tokenId": 0,
  "artwork": {"id": "","category": "","tags": [],"owner": {"id": "","image": "","username": ""},"creator": {"id": "","image": "","username": "","collections": [],"type": ""},
    "featuredImage": {"media": "","mediaType": 0},"isBidding": true,"gallery": [{"media": "","mediaType": 0}],"description": "","price": 0,"currency": "",
    "dateIssued": new Date(),"hasActiveAuction": true, "lastAuctionId": 0,"likes": 0,"sold": false,"name": "","tokenId": 0,"symbol": "", "assetType": "digital", "type": ""},"type": ""};

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
        StripeService, PaymentService, AuctionService],
    })
    .compileComponents();
  });

  beforeEach(() => {
    auctionService = TestBed.inject(AuctionService) as jasmine.SpyObj<AuctionService>;
    fixture = TestBed.createComponent(AssetDetailsComponent);
    component = fixture.componentInstance;
    component.artwork = artwork;
    component.auction = auction;
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
