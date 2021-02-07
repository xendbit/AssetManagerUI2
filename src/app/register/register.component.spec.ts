
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormsModule, NgForm, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AssetsService } from '../services/assets.service';
import { RegisterComponent } from './register.component';
import { registerValues, requestPasswordResp } from 'src/mocks';


let routerSpy;
const loginServiceSpy = jasmine.createSpyObj('LoginService', ['register']);
const AssetsServiceSpy = jasmine.createSpyObj('AssetsService', ['showNotification', 'getPassphrase', 'showSpinner', 'stopSpinner']);

let registerFormGroup:FormGroup;
let fb:FormBuilder;

let httpClient: HttpClient;


describe('RegisterComponent Unit Test', () => {
  let fixture: ComponentFixture<RegisterComponent>;
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
      declarations: [RegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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


    // loginSpy = loginServiceSpy.register.and.returnValue(of(requestPasswordResp));
    assetSpy = AssetsServiceSpy.getPassphrase.and.returnValue(of(requestPasswordResp));

  }));

  it('should create RegisterComponent', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should get a passphrase on ngOnInit', fakeAsync(() => {
    fixture.componentInstance.ngOnInit()

    assetSpy = AssetsServiceSpy.getPassphrase.and.returnValue(of(requestPasswordResp))

    expect(AssetsServiceSpy.getPassphrase).toHaveBeenCalled();
    expect(fixture.componentInstance.passphrase).toBe(requestPasswordResp.data)
  }));

  it('should call register() and navigate to /login for a valid response', fakeAsync(() => {
    loginSpy = loginServiceSpy.register.and.returnValue(of(requestPasswordResp));
    let form = <NgForm><unknown>registerFormGroup
    registerFormGroup.setValue(registerValues)

    fixture.componentInstance.passphrase = 'TEST'
    fixture.componentInstance.register(form)


    tick(15000)
    
    expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
    expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
    expect(navArgs).toBe('/login');
  }));

  it('should call register() and throw an error', fakeAsync(() => {
    const error = {
      "status": "error",
      "error": {
        "statusCode": 500,
        "timestamp": "2021-01-30T18:54:15.405Z",
        "path": "/v3/user/new-user",
        "error": [
          "bvn should not be empty",
          "firstName should not be empty",
          "middleName should not be empty",
          "lastName should not be empty"
        ]
      }
    }
    loginSpy = loginServiceSpy.register.and.returnValue(throwError(error));
    let form = <NgForm><unknown>registerFormGroup
    registerFormGroup.setValue(registerValues)

    fixture.componentInstance.passphrase = 'TEST'
    fixture.componentInstance.register(form)


    tick(15000)
    
    expect(AssetsServiceSpy.showSpinner).toHaveBeenCalled();
    expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    expect(AssetsServiceSpy.stopSpinner).toHaveBeenCalled();
  }));

  it('should call login() and navigate to /login', fakeAsync(() => {
    fixture.componentInstance.login()


    tick(15000)
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
    expect(navArgs).toBe('/login');
  }));
});


