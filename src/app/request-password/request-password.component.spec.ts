import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormsModule, NgForm, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestPasswordComponent } from './request-password.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { requestPasswordResp } from 'src/mocks';
import { AssetsService } from '../services/assets.service';


let routerSpy;
const loginServiceSpy = jasmine.createSpyObj('LoginService', ['requestToken']);
const AssetsServiceSpy = jasmine.createSpyObj('AssetsService', ['showNotification']);

const testUserData = { id: 1, name: 'TekLoon'};
const loginErrorMsg = 'Invalid Login';

let loginCredentials:FormGroup;
let fb:FormBuilder;

let httpClient: HttpClient;


describe('RequestPasswordComponent Unit Test', () => {
  let fixture: ComponentFixture<RequestPasswordComponent>;
  let loginSpy;
//   function updateForm(userEmail, userPassword) {
//     fixture.componentInstance.loginForm.controls['username'].setValue(userEmail);
//     fixture.componentInstance.loginForm.controls['password'].setValue(userPassword);
//   }

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
            },
        },
      ],
      declarations: [RequestPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPasswordComponent);
    // router = TestBed.get(Router);
    // httpClient = TestBed.get(HttpClient);
    fb = TestBed.get(FormBuilder);

    loginSpy = loginServiceSpy.requestToken.and.returnValue(of(requestPasswordResp));

  }));

  // it('loginService login() should called ', fakeAsync(() => {
  //   updateForm(validUser.username, validUser.password);
  //   fixture.detectChanges();
  //   const button = fixture.debugElement.nativeElement.querySelector('button');
  //   button.click();
  //   fixture.detectChanges();

  //   expect(loginServiceSpy.login).toHaveBeenCalled();
  // }));

  it('should call onSubmit() and navigate to /change-password and show success notification', fakeAsync(() => {
    // updateForm(validUser.username, validUser.password);
    fixture.componentInstance.email = 'mock@gmail.com'
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    // button.click();
    loginCredentials = fb.group({
        email: [''],
    //   password: ['']
    }); 
    let logi = <NgForm><unknown>loginCredentials
    loginCredentials.value.email = 'mock@gmail.com'
    // loginCredentials.value.password = 'mock'
    fixture.componentInstance.onSubmit(logi)
    // advance(fixture);

    loginSpy = loginServiceSpy.requestToken.and.returnValue(of(requestPasswordResp));
    // advance(fixture);

    tick(15000)
    
    expect(fixture.componentInstance.submitted).toBe(true, 'submitted should be true')
    expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
    expect(navArgs).toBe('/change-password');
  }));

  it('should call register() and navigate to /login', fakeAsync(() => {
    // updateForm(validUser.username, validUser.password);
    fixture.componentInstance.email = 'mock@gmail.com'
    fixture.detectChanges();

    fixture.componentInstance.register()
    // advance(fixture);

    // advance(fixture);

    // tick(15000)
    
    // expect(fixture.componentInstance.submitted).toBe(true, 'submitted should be true')
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
    expect(navArgs).toBe('/login');
  }));
  function advance(f: ComponentFixture<any>) {
    tick();
    f.detectChanges();
  }

  afterAll(async () => {
    console.log('object :>> ', routerSpy.navigateByUrl.calls.all());
  });
});

