
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormsModule, NgForm, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { genericAssetResp, getAssetsResp, registerValues, requestPasswordResp } from 'src/mocks';
import { AssetsService } from '../services/assets.service';
import { AdminAssetsComponent } from './admin-assets.component';


let routerSpy;
const loginServiceSpy = jasmine.createSpyObj('LoginService', ['approve', 'underSubscribe']);
const AssetsServiceSpy = jasmine.createSpyObj('AssetsService', ['showNotification', 'getPassphrase', 'showSpinner', 'stopSpinner', 'getAllAssets']);

let registerFormGroup:FormGroup;
let fb:FormBuilder;

let httpClient: HttpClient;


describe('AdminAssetsComponent Unit Test', () => {
  let fixture: ComponentFixture<AdminAssetsComponent>;
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
        {provide: LoginService, useValue: loginServiceSpy},
        {provide: AssetsService, useValue: AssetsServiceSpy},
        FormBuilder,
        { provide: Router, useValue: routerSpy },
      ],
      declarations: [AdminAssetsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAssetsComponent);
    fb = TestBed.get(FormBuilder);

    registerFormGroup = fb.group({
      email: [''],
      password: [''],
      role: [''],
      bvn: [''],
      firstName: [''],
      middleName: [''],
      lastName: ['']
    });

    assetSpy = AssetsServiceSpy.getAllAssets.and.returnValue(of(getAssetsResp));

  }));

  it('should create AdminAssetsComponent', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call getAssets(), return response and set value for this.assets on ngOnInit', fakeAsync(() => {
    fixture.componentInstance.ngOnInit()

    assetSpy = AssetsServiceSpy.getAllAssets.and.returnValue(of(getAssetsResp))

    expect(AssetsServiceSpy.getAllAssets).toHaveBeenCalled();
    expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
    expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
    expect(fixture.componentInstance.assets).toBe(getAssetsResp.data.items);
  }));

  it('should call getAssets(), throw an error and stop spinner', fakeAsync(() => {
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

    fixture.componentInstance.ngOnInit()

    tick(15000)
    
    expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
    expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
  }));

  it('should call delete(), return valid response and show notification', fakeAsync(() => {
    loginSpy = loginServiceSpy.underSubscribe.and.returnValue(of(genericAssetResp));

    fixture.componentInstance.delete('testTokenId', 0)

    assetSpy = AssetsServiceSpy.getAllAssets.and.returnValue(of(getAssetsResp))

    expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    expect(AssetsServiceSpy.getAllAssets).toHaveBeenCalled();
    expect(fixture.componentInstance.assets).toBe(getAssetsResp.data.items)
    // AssetsServiceSpy.showNotification.calls.reset()
  }));

  it('should call delete(), throw an error and stop spinner', fakeAsync(() => {
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

    loginServiceSpy.underSubscribe.and.returnValue(throwError(error));

    AssetsServiceSpy.getAllAssets.and.returnValue(of(getAssetsResp))

    fixture.componentInstance.delete('testTokenId', 0)
    // fixture.componentInstance.userId = 30

    tick(15000)
    
    expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
    expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
    // expect(fixture.componentInstance.error).toBeDefined()
  }));
  
  afterEach(async(() => {
    AssetsServiceSpy.showNotification.calls.reset()
    AssetsServiceSpy.showSpinner.calls.reset()
    AssetsServiceSpy.stopSpinner.calls.reset()
  }));
});
