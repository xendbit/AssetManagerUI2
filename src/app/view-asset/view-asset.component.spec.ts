
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormsModule, NgForm, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { genericAssetResp, getAssetsResp, getAssetsByTokenIdResp } from 'src/mocks';
import { AssetsService } from '../services/assets.service';
import { ViewAssetComponent } from './view-asset.component';


let routerSpy;
const loginServiceSpy = jasmine.createSpyObj('LoginService', ['register', 'approve']);
const AssetsServiceSpy = jasmine.createSpyObj('AssetsService', ['showNotification', 'getAllAssets', 'showSpinner', 'stopSpinner', 'getWaletBalance', 'getAssetsByTokenId', 'buyAsset']);

let buyFormGroup: FormGroup;
let fb: FormBuilder;

let httpClient: HttpClient;


describe('ViewAssetComponent Unit Test', () => {
  let fixture: ComponentFixture<ViewAssetComponent>;
  let loginSpy;
  let assetSpy;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        // RouterTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: AssetsService, useValue: AssetsServiceSpy },
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                get(): string {
                  return '1';
                },
              },
            },
            paramMap: of(null)
          },
        },
      ],
      declarations: [ViewAssetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAssetComponent);
    fb = TestBed.get(FormBuilder);

    buyFormGroup = fb.group({
      amount: [''],
      orderStrategy: [''],
      price: ['']
    });


    // loginSpy = loginServiceSpy.register.and.returnValue(of(requestPasswordResp));
    // assetSpy = AssetsServiceSpy.getPassphrase.and.returnValue(of(requestPasswordResp));

  }));

  describe('OnInit unit test', () => {
    it('should create ViewAssetComponent', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should call getBalance(), getAssets(), getAssetDetails(), set values on ngOnInit', fakeAsync(() => {
      fixture.componentInstance.getBalance = jasmine.createSpy('getBalance')
      fixture.componentInstance.getAssets = jasmine.createSpy('getAssets')
      fixture.componentInstance.getAssetDetails = jasmine.createSpy('getAssetDetails')

      // mock readonly window object
      delete (window as any).history;

      const history = {
        state: {
          tokenId: 20,
          from: "buyPage"
        }
      };

      Object.defineProperty(window, "history", {
        configurable: true,
        enumerable: true,
        value: history,
        writable: true
      });


      fixture.componentInstance.ngOnInit()
      fixture.componentInstance.userId = 30

      tick()
      expect(fixture.componentInstance.userId).not.toBeNull('user id should be assigned a value')

      expect(fixture.componentInstance.getBalance).toHaveBeenCalled();
      expect(fixture.componentInstance.getAssets).toHaveBeenCalled();
      expect(fixture.componentInstance.tokenId).toBe(window.history.state.tokenId)
      expect(fixture.componentInstance.pageHistory).toBe(window.history.state.from)
      expect(fixture.componentInstance.getAssetDetails).toHaveBeenCalled();


      // AssetsServiceSpy.getWaletBalance.and.returnValue(of(genericAssetResp));
      // AssetsServiceSpy.getAllAssets.and.returnValue(of(getAssetsResp));
      // AssetsServiceSpy.getAssetsByTokenId.and.returnValue(of(getAssetsByTokenIdResp));

      // // mock readonly window object
      // delete (window as any).history;

      // const history = {
      //   state: {
      //     tokenId: 20,
      //     from: "buyPage"
      //   }
      // };

      // Object.defineProperty(window, "history", {
      //   configurable: true,
      //   enumerable: true,
      //   value: history,
      //   writable: true
      // });


      // fixture.componentInstance.ngOnInit()
      // fixture.componentInstance.userId = 30

      // tick()
      // expect(fixture.componentInstance.userId).not.toBeNull('user id should be assigned a value')

      // expect(AssetsServiceSpy.getWaletBalance).toHaveBeenCalled();
      // expect(fixture.componentInstance.balance).toBe(<any>genericAssetResp.data)

      // expect(AssetsServiceSpy.getAllAssets).toHaveBeenCalled();
      // expect(fixture.componentInstance.assets).toBe(getAssetsResp.data.items)
      // expect(fixture.componentInstance.approved.length).toBe(8)
      // expect(fixture.componentInstance.unapproved.length).toBe(1)

      // expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      // expect(AssetsServiceSpy.getAssetsByTokenId).toHaveBeenCalled();
      // expect(fixture.componentInstance.asset).toBe(getAssetsByTokenIdResp.data)
      // expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();

      // // expect(fixture.componentInstance.passphrase).toBe(requestPasswordResp.data)
    }));
  })

  describe('getBalance() function unit test', () => {

    it('should call AssetsService.getWaletBalance() and set values for userid and balance', fakeAsync(() => {
      AssetsServiceSpy.getWaletBalance.and.returnValue(of(genericAssetResp));

      fixture.componentInstance.getBalance()
      fixture.componentInstance.userId = 30

      tick()
      expect(fixture.componentInstance.userId).not.toBeNull('user id should be assigned a value')

      expect(AssetsServiceSpy.getWaletBalance).toHaveBeenCalled();
      expect(fixture.componentInstance.balance).toBe(<any>genericAssetResp.data)
    }));

    it('throw an error and set value to this.error object', fakeAsync(() => {
      try {
        const error = {
          error: {
            "status": "error",
            "data": {
              "statusCode": 500,
              "timestamp": "2021-02-01T13:47:48.021Z",
              "path": "/v3/assets/new-order",
              "error": [
                "amount must be a number conforming to the specified constraints",
                "amount should not be empty"
              ]
            }
          }
        }

        AssetsServiceSpy.getWaletBalance.and.returnValue(throwError(error));

        fixture.componentInstance.getBalance()
        fixture.componentInstance.userId = 30

        tick(15000)

        expect(fixture.componentInstance.error).toBeDefined()
        expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
      } catch (e) {
        console.log("error from test block", e);
        expect(e).toBeDefined();
      }
    }));
  })

  describe('getAssets() function unit test', () => {

    it('should call AssetsService.getAllAssets() and set values for assets, approved and unapproved', fakeAsync(() => {
      AssetsServiceSpy.getAllAssets.and.returnValue(of(getAssetsResp));

      fixture.componentInstance.getAssets()

      tick()

      expect(AssetsServiceSpy.getAllAssets).toHaveBeenCalled();
      expect(fixture.componentInstance.assets).toBe(getAssetsResp.data.items)
      expect(fixture.componentInstance.primaryMarket).toBeDefined('primaryMarket should be defined');
      //   expect(fixture.componentInstance.approved.length).toBe(8)
      //   expect(fixture.componentInstance.unapproved.length).toBe(1)
    }));

    it('throw an error and set value to this.error object', fakeAsync(() => {
      const error = {
        error: {
          "status": "error",
          "data": {
            "statusCode": 500,
            "timestamp": "2021-02-01T13:47:48.021Z",
            "path": "/v3/assets/new-order",
            "error": [
              "amount must be a number conforming to the specified constraints",
              "amount should not be empty"
            ]
          }
        }
      }

      AssetsServiceSpy.getAllAssets.and.returnValue(throwError(error));

      fixture.componentInstance.getAssets()
      fixture.componentInstance.userId = 30

      tick(15000)

      expect(fixture.componentInstance.error).toBeDefined()
    }));
  })

  xdescribe('getAssetDetails() function unit test', () => {

    it('should call AssetsService.getAssetsByTokenId() and set value to asset', fakeAsync(() => { 
      try {
        AssetsServiceSpy.getAssetsByTokenId.and.returnValue(of(getAssetsByTokenIdResp));


        fixture.componentInstance.getAssetDetails()
        fixture.componentInstance.tokenId = 20

        tick()

        expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
        expect(AssetsServiceSpy.getAssetsByTokenId).toHaveBeenCalled();
        expect(fixture.componentInstance.asset).toBe(getAssetsByTokenIdResp.data)
        expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled(); 
      } catch (e) {
        console.log("error from test block", e);
        expect(e).toBeDefined();
      }
    }));

    it('throw an error, stop spinner and set value to this.error object', fakeAsync(() => {
      try {
      const error = {
        error: {
          "status": "error",
          "data": {
            "statusCode": 500,
            "timestamp": "2021-02-01T13:47:48.021Z",
            "path": "/v3/assets/new-order",
            "error": [
              "amount must be a number conforming to the specified constraints",
              "amount should not be empty"
            ]
          }
        }
      }

      AssetsServiceSpy.getAssetsByTokenId.and.returnValue(throwError(error));

      fixture.componentInstance.getAssetDetails()
      // fixture.componentInstance.userId = 30

      tick(15000)

      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(fixture.componentInstance.error).toBeDefined()
    } catch (e) {
      console.log("error from test block", e);
      expect(e).toBeDefined();
    }
    }));
  })

  describe('viewBuy() function unit test', () => {
    it('viewBuy() should define tokenId and call getAssetDetails()', fakeAsync(() => {
      AssetsServiceSpy.getAssetsByTokenId.and.returnValue(of(getAssetsByTokenIdResp));
      fixture.componentInstance.getAssetDetails = jasmine.createSpy('getAssetDetails')

      fixture.componentInstance.viewBuy('tokenId', null)

      expect(fixture.componentInstance.tokenId).toBe('tokenId')
      expect(fixture.componentInstance.getAssetDetails).toHaveBeenCalled();
    }));
  })

  describe('buy() function unit test', () => {

    it('should call buy(), show notification, stop spinner & navigate to home when response.status === success', fakeAsync(() => {
      AssetsServiceSpy.buyAsset.and.returnValue(of(genericAssetResp));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.buy(form)

      tick(15000)

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
      expect(navArgs).toBe('/home');
    }));

    it('should call buy(), show notification, stop spinner when response.status !== success', fakeAsync(() => {
      const resp = { ...genericAssetResp }
      resp.status = 'error'
      AssetsServiceSpy.buyAsset.and.returnValue(of(resp));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.buy(form)

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    }));

    it('should call buy(), throw an error and set value to this.error object', fakeAsync(() => {
      const error = {
        error: {
          "status": "error",
          "data": {
            "statusCode": 500,
            "timestamp": "2021-02-01T13:47:48.021Z",
            "path": "/v3/assets/new-order",
            "error": [
              "amount must be a number conforming to the specified constraints",
              "amount should not be empty"
            ]
          }
        }
      }

      AssetsServiceSpy.buyAsset.and.returnValue(throwError(error));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.buy(form)

      tick(15000)

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(fixture.componentInstance.error).toBeDefined()
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    }));

    it('should call buy() and show notification if amount > this.asset.sharesAvailable', fakeAsync(() => {
      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable + 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.buy(form)

      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    }));
  })

  describe('sell() function unit test', () => {

    it('should call sell(), show notification, stop spinner & navigate to home when response.status === success', fakeAsync(() => {
      AssetsServiceSpy.buyAsset.and.returnValue(of(genericAssetResp));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.sell(form, 'tokenId')

      tick(15000)

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
      expect(navArgs).toBe('/home');
    }));

    it('should call sell(), show notification, stop spinner when response.status !== success', fakeAsync(() => {
      const resp = { ...genericAssetResp }
      resp.status = 'error'
      AssetsServiceSpy.buyAsset.and.returnValue(of(resp));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.sell(form, 'tokenId')

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    }));

    it('should call sell(), throw an error and set value to this.error object', fakeAsync(() => {
      try {
        const error = {
          error: {
            "status": "error",
            "data": {
              "statusCode": 500,
              "timestamp": "2021-02-01T13:47:48.021Z",
              "path": "/v3/assets/new-order",
              "error": [
                "amount must be a number conforming to the specified constraints",
                "amount should not be empty"
              ]
            }
          }
        }

        AssetsServiceSpy.buyAsset.and.returnValue(throwError(error));

        fixture.componentInstance.asset = getAssetsByTokenIdResp.data
        fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

        let form = <NgForm><unknown>buyFormGroup
        buyFormGroup.patchValue({ amount: 3, price: undefined })

        fixture.componentInstance.sell(form, 'tokenId')

        tick(15000)

        expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
        expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
        expect(fixture.componentInstance.error).toBeDefined()
        expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
      } catch (e) {
        console.log("error from test block", e);
        expect(e).toBeDefined();
      }
    }));

  })

  describe('approve() function unit test', () => {

    it('should call approve(), show notification, stop spinner & navigate to /admin-dashboard when response.status === success', fakeAsync(() => {
      loginSpy = loginServiceSpy.approve.and.returnValue(of(genericAssetResp));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.approve('tokenId', true)

      tick(15000)

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
      expect(navArgs).toBe('/admin-dashboard');
    }));

    it('should call approve(), show notification and stop spinner when response.status !== success', fakeAsync(() => {
      const resp = { ...genericAssetResp }
      resp.status = 'error'
      loginSpy = loginServiceSpy.approve.and.returnValue(of(resp));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      fixture.componentInstance.approve('tokenId', true)

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    }));

    it('should call approve(), throw an error and set value to this.error object', fakeAsync(() => {
      try {
      const error = {
        error: {
          "status": "error",
          "data": {
            "statusCode": 500,
            "timestamp": "2021-02-01T13:47:48.021Z",
            "path": "/v3/assets/new-order",
            "error": [
              "amount must be a number conforming to the specified constraints",
              "amount should not be empty"
            ]
          }
        }
      }

      loginSpy = loginServiceSpy.approve.and.returnValue(throwError(error));

      fixture.componentInstance.asset = getAssetsByTokenIdResp.data
      fixture.componentInstance.amount = getAssetsByTokenIdResp.data.sharesAvailable - 1

      let form = <NgForm><unknown>buyFormGroup
      buyFormGroup.patchValue({ amount: 3, price: undefined })

      fixture.componentInstance.approve('tokenId', true)

      tick(15000)

      expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
      expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
      expect(fixture.componentInstance.error).toBeDefined()
      expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    } catch (e) {
      console.log("error from test block", e);
      expect(e).toBeDefined(); 
    }
    }));

  })

  afterEach(async(() => {
    AssetsServiceSpy.showNotification.calls.reset()
    AssetsServiceSpy.showSpinner.calls.reset()
    AssetsServiceSpy.stopSpinner.calls.reset()
    AssetsServiceSpy.getWaletBalance.calls.reset()
  }));
});
