import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http'
import { of } from 'rxjs';
import { TestHelpers } from '../test-helpers';

describe('LoginService', () => {
    let service: LoginService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const baseUrl = 'http://35.224.252.52:8080/v3';
    const api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';

    beforeEach(() => {

        //Configures testing app module
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                LoginService,
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(LoginService);

    });

    afterEach(() => {
        httpTestingController.verify(); //Verifies that no requests are outstanding.
    });

    describe('#loginServiceFunctions', () => {

        it('should check the login service has be created', () => {
            expect(service).toBeTruthy();
        });

        //Test case 1
        it('should make a login POST API request with login object', () => {
            service.login(TestHelpers.mockTestLogin.email, TestHelpers.mockTestLogin.password).subscribe((login) => {                
            });
            const req = httpTestingController.expectOne(`${baseUrl}/user/login`);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(TestHelpers.mockTestLogin);
            req.flush(TestHelpers.mockTestLogin); //Return expected object
        });

        //Test case 2
        it('should make a POST API call to register a user with register body object', () => {
            service.register(TestHelpers.postMockObj).subscribe((register) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/user/new-user`);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(TestHelpers.postMockObj);
            req.flush(TestHelpers.postMockObj);
        });

        //Test case 3
        it('should make a POST API call to get a password reset token with a body object', () => {
            service.requestToken(TestHelpers.postMockObj).subscribe((token) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/user/request-password-reset-token`);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(TestHelpers.postMockObj);
            req.flush(TestHelpers.postMockObj);
        });

        //Test case 4
        it('should make a POST API call to change password with a body object', () => {
            service.changePassword(TestHelpers.postMockObj).subscribe((token) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/user/change-password`);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(TestHelpers.postMockObj);
            req.flush(TestHelpers.postMockObj);
        });

        //Test case 5
        it('should make a POST request to approve a user, check the tokenID and status parameters are in the url', () => {
            service.approve(TestHelpers.testTokenId, TestHelpers.boolStatus).subscribe((admin) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/admin/change-approval-status/${TestHelpers.testTokenId}/${TestHelpers.boolStatus}`);
            console.log("check the req ", req);
            expect(req.request.url).toContain(TestHelpers.testTokenId);
            expect(req.request.url).toContain(TestHelpers.boolStatus.toString());
            req.flush({});
        });

    });


});