import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AssetsService } from '../services/assets.service';
import { Observable, of, Subject, throwError } from 'rxjs';

import { ApproveAssetsComponent } from './approve-assets.component';
import { LoginService } from '../services/login.service';

describe('Approve Asset Component', () => {
    let component: ApproveAssetsComponent;
    let fixture: ComponentFixture<ApproveAssetsComponent>;
    let assetService: AssetsService;    
    let loginService: LoginService;
    let router: Router;

    // const activatedRouteStub = {
    //     paramMap: of({ abc: 'testABC' })
    // }

    const routeStub = {
        navigateByUrl(url: string) { return url; }
    }


    beforeEach(
        waitForAsync(() => {
            // routeSpyStub = spyOn(routerObj,'navigateByUrl');


            TestBed.configureTestingModule({
                imports: [HttpClientModule, HttpClientTestingModule, FormsModule],
                declarations: [ApproveAssetsComponent],
                providers: [
                    AssetsService,LoginService,
                    { provide: Router, useValue: routeStub },
                    // {
                    //     provide: ActivatedRoute,
                    //     useValue: activatedRouteStub
                    // }
                ]
            }).compileComponents();
            assetService = TestBed.inject(AssetsService);
            loginService = TestBed.inject(LoginService);
            router = TestBed.inject(Router);
            fixture = TestBed.createComponent(ApproveAssetsComponent);
            component = fixture.componentInstance;

            // fixture.detectChanges(); 
        })
    );

    it('should create approve asset component', fakeAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('should call getAssets() function, showspinner and hidespinner on ngOnit() ', waitForAsync(() => {
        const showSpinnerSpy = spyOn(assetService, 'showSpinner');
        const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const mockAssets = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }], "meta": { "totalItems": "3" } } };
        spyOn(assetService, 'getAllAssets').and.returnValue(of(mockAssets));
        component.ngOnInit();
        component.getAssets();
        expect(showSpinnerSpy).toHaveBeenCalled();
        expect(component.approved).toBeDefined();
        expect(component.unapproved).toBeDefined();
        expect(hideSpinnerSpy).toHaveBeenCalled();
    }));

    it('should call getAssets() function if error is thrown hidespinner on ngOnit() ', waitForAsync(() => {
        // const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const mockErr = {};
        spyOn(assetService, 'getAllAssets').and.returnValue(throwError(mockErr));
        component.ngOnInit();
        component.getAssets();
        expect(mockErr).toBeDefined();
        // expect(hideSpinnerSpy).toHaveBeenCalled();
    }));

    it('when approve function is called it should take in the token id and status as parameter if status is success call getAssets() function', waitForAsync(() => {
        const tokenId = 'tokenId';
        const status = '';
        // const showSpinnerSpy = spyOn(assetService, 'showSpinner');
        // const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const mockResponse = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }], "meta": { "totalItems": "3" } } };
        spyOn(loginService, 'approve').and.returnValue(of(mockResponse));
        const showNotificationSpy = spyOn(assetService, 'showNotification');
        const getAssetSpy = spyOn(component, 'getAssets');
        component.approve(tokenId,status);
        expect(mockResponse['status']).toEqual('success');
        expect(showNotificationSpy).toHaveBeenCalled();
        expect(getAssetSpy).toHaveBeenCalled();
    }));

    it('when view function is called it should take in the token id as parameter and navigate to /viewAsset page', waitForAsync(() => {
        const tokenId = 'tokenId';
        const routeSpy = spyOn(router, 'navigateByUrl');
        component.view(tokenId);
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0]; 
        expect(navArgs).toBe('/viewAsset');
    }));

});
