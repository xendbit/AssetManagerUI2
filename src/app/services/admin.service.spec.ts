// import { TestBed } from '@angular/core/testing';

// import { AdminService } from './admin.service';

// describe('AdminService', () => {
//   // let service: AdminService;

//   // beforeEach(() => {
//   //   TestBed.configureTestingModule({});
//   //   service = TestBed.inject(AdminService);
//   // });

//   // it('should be created', () => {
//   //   expect(service).toBeTruthy();
//   // });
// });
import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { TestMockData } from '../test-mock-data';
import { of } from 'rxjs';
// import * as sinon from 'sinon';



describe('AdminService', () => {
  let service: AdminService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'http://35.224.252.52:8080/v3';
  const api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';


  beforeEach(() => {

    //Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminService,
      ]
    });

    //Instantaites HttpClient, HttpTestingController and AdminService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AdminService);

  });

  afterEach(() => {
    httpTestingController.verify(); //Verifies that no requests are outstanding.
  });

  describe('#adminServiceFunctions', () => {

    it('should check the admin service has be created', () => {
      expect(service).toBeTruthy();
    });

    //Test case 1
    it('should make a POST API call to register an admin', () => {
      service.registerAdmin(TestMockData.postMockObj).subscribe((admin) => {
        expect(admin).toBeDefined(), fail;
      });
      const req = httpTestingController.expectOne(`${baseUrl}/user/new-user`);
      expect(req.request.method).toEqual('POST');
      req.flush(TestMockData.postMockObj);
    });

    //Test case 2
    it('should make a POST request to register an admin with an object', () => {
      service.registerAdmin(TestMockData.postMockObj).subscribe(
        admin => expect(admin).toEqual(TestMockData.postMockObj, 'should return an register object'),
        fail
      );
      const req = httpTestingController.expectOne(`${baseUrl}/user/new-user`);
      expect(req.request.body).toEqual(TestMockData.postMockObj);
      req.flush({});
    });

    //Test case 3
    const boolStatus = true;
    const tokenId = 'testtokenID123';
    it('should make a POST API call to approve a user', () => {
      service.approve(tokenId, boolStatus).subscribe((admin) => {
      });
      const req = httpTestingController.expectOne(`${baseUrl}/admin/change-approval-status/${tokenId}/${boolStatus}`);
      expect(req.request.method).toEqual('POST');
      req.flush({});
    });

    //Test case 4
    it('should make a POST request to approve a user, check the tokenID and status parameters are in the url', () => {
      service.approve(tokenId, boolStatus).subscribe((admin) => {
      });
      const req = httpTestingController.expectOne(`${baseUrl}/admin/change-approval-status/${tokenId}/${boolStatus}`);
      console.log("check the req ", req);
      expect(req.request.url).toContain(tokenId);
      expect(req.request.url).toContain(boolStatus.toString());
      req.flush({});
    });

    //Test case 5
    it('should make a login POST API request with login object', () => {
      const loginObject = {
        email: "test@email.com",
        password: "passpass"
      }
      service.login(loginObject.email, loginObject.password).subscribe((login) => {
      });
      const req = httpTestingController.expectOne(`${baseUrl}/admin/login`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(loginObject);
      req.flush(loginObject); //Return expected object
    });

  });


});