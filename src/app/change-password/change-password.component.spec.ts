import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, FormsModule, NgForm, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { changePWValueValid, requestPasswordResp } from 'src/mocks';
import { AssetsService } from '../services/assets.service';
import { ChangePasswordComponent } from './change-password.component';


let routerSpy;
const loginServiceSpy = jasmine.createSpyObj('LoginService', ['changePassword']);
const AssetsServiceSpy = jasmine.createSpyObj('AssetsService', ['showNotification']);

let changePassword:FormGroup;
let fb:FormBuilder;

let httpClient: HttpClient;


describe('ChangePasswordComponent Unit Test', () => {
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let loginSpy;

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
      declarations: [ChangePasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    fb = TestBed.get(FormBuilder);

    changePassword = fb.group({
        password: [''],
        retypePassword: [''],
        token: [''],
    });


    loginSpy = loginServiceSpy.changePassword.and.returnValue(of(requestPasswordResp));

  }));

  it('should create ChangePasswordComponent', () => {
    expect(fixture.componentInstance).toBeTruthy();
    });

  it('should call onSubmit() and navigate to /change-password and show notification when password match', fakeAsync(() => {
    let logi = <NgForm><unknown>changePassword
    changePassword.value.password = changePWValueValid.password
    changePassword.value.retypePassword = changePWValueValid.retypePassword
    changePassword.value.token = changePWValueValid.token

    fixture.componentInstance.onSubmit(logi)

    loginSpy = loginServiceSpy.changePassword.and.returnValue(of(requestPasswordResp));

    tick(15000)
    
    expect(fixture.componentInstance.submitted).toBe(true, 'submitted should be true')
    expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
    expect(navArgs).toBe('/change-password');
  }));

  it('should call onSubmit() and show notification when password does not match', fakeAsync(() => {
    let logi = <NgForm><unknown>changePassword
    changePassword.value.password = changePWValueValid.password
    changePassword.value.retypePassword = 'wrong'
    changePassword.value.token = changePWValueValid.token

    fixture.componentInstance.onSubmit(logi)

    loginSpy = loginServiceSpy.changePassword.and.returnValue(of(requestPasswordResp));

    expect(AssetsServiceSpy.showNotification).toHaveBeenCalled();
  }));

//   it('should call register() and navigate to /login', fakeAsync(() => {
//     // updateForm(validUser.username, validUser.password);
//     fixture.componentInstance.password = 'mock@gmail.com'
//     fixture.detectChanges();

//     fixture.componentInstance.register()
//     // advance(fixture);

//     // advance(fixture);

//     // tick(15000)
    
//     // expect(fixture.componentInstance.submitted).toBe(true, 'submitted should be true')
//     expect(routerSpy.navigateByUrl).toHaveBeenCalled();
//     const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
//     expect(navArgs).toBe('/login');
//   }));

  afterAll(async () => {
    console.log('object :>> ', routerSpy.navigateByUrl.calls.all());
  });
});


