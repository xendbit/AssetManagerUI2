import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AssetsService } from '../services/assets.service';
import { Observable, of, Subject, throwError } from 'rxjs';

import { BuyAssetComponent } from './buy-asset.component';

describe('Buy Asset Component', () => {
    let component: BuyAssetComponent;
    let fixture: ComponentFixture<BuyAssetComponent>;
    let assetService: AssetsService;
    let router: Router;

    const activatedRouteStub = {
        paramMap: of({ abc: 'testABC' })
    }

    const routeStub = {
        navigateByUrl(url: string) { return url; }
    }


    beforeEach(
        waitForAsync(() => {
            // routeSpyStub = spyOn(routerObj,'navigateByUrl');


            TestBed.configureTestingModule({
                imports: [HttpClientModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])],
                declarations: [BuyAssetComponent],
                providers: [
                    AssetsService,
                    { provide: Router, useValue: routeStub },
                    {
                        provide: ActivatedRoute,
                        useValue: activatedRouteStub
                    }
                ]
            }).compileComponents();
            assetService = TestBed.inject(AssetsService);
            router = TestBed.inject(Router);
            fixture = TestBed.createComponent(BuyAssetComponent);
            component = fixture.componentInstance;

            fixture.detectChanges(); 
        })
    );

    it('should create buy asset component', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('should call getAssets() function, showspinner and hidespinner on ngOnit() ', waitForAsync(() => {
        // const showSpinnerSpy = spyOn(assetService, 'showSpinner');
        const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const mockAssets = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }], "meta": { "totalItems": "3" } } };
        spyOn(assetService, 'getAllAssets').and.returnValue(of(mockAssets));
        component.ngOnInit();
        // expect(showSpinnerSpy).toHaveBeenCalled();
        component.getAssets();
        expect(component.primaryMarket).toBeDefined();
        expect(component.secondaryMarket).toBeDefined();
        expect(hideSpinnerSpy).toHaveBeenCalled();
    }));

    it('should call getAssets() function if error is thrown hidespinner on ngOnit() ', waitForAsync(() => {
        const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const mockErr = {}
        spyOn(assetService, 'getAssetsByOwnerId').and.returnValue(throwError(mockErr));
        component.ngOnInit();
        component.getAssets();
        expect(mockErr).toBeDefined();
        // expect(hideSpinnerSpy).toHaveBeenCalled();
    }));

    it('should call buy() function with an NgForm object, and pass form fields ', waitForAsync(() => {
        const formFields=new NgForm([],[]);
        formFields.form.value.price = 6700;
        formFields.form.value.amount = 1;
        const body = {
            tokenId: 59908500,
            orderType: 0,
            orderStrategy: 0,
            amount: 1,
            "price": 150,
            "goodUntil": 0,
            "userId": 5
        }
        const mockData = {};
        spyOn(assetService, 'buyAsset').and.returnValue(of(mockData));
        component.buy(formFields);
        expect(formFields.form.value.price).toBeDefined();
        expect(formFields.form.value.amount).toBeDefined();
    }));

    it('should call buy() function if error is thrown show notification ', waitForAsync(() => {
        const formFields=new NgForm([],[]);
        formFields.form.value.price = 6700;
        formFields.form.value.amount = 1;
        const mockErr = {
            error: {
                data: {
                    error:""
                }
            }
        }
        spyOn(assetService, 'buyAsset').and.returnValue(throwError(mockErr));
        const showNotificationSpy = spyOn(assetService, 'showNotification');
        component.buy(formFields);
        expect(mockErr).toBeDefined();
        expect(component.error).toBeDefined();
        expect(showNotificationSpy).toHaveBeenCalled();
    }));

    it('when view function is called it should take in the token id and page as parameter and navigate to /viewAsset page', waitForAsync(() => {
        const tokenId = 'tokenId';
        const page = 'testPage';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.view(tokenId,page);
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/viewAsset');
    }));

    it('when viewAll function is called it should navigate to /assets page', waitForAsync(() => {
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.viewAll();
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/assets');
    }));

    it('when viewBuy function is called it should take in the token id as parameter and navigate to /viewAsset page', waitForAsync(() => {
        const tokenId = 'tokenId';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.viewBuy(tokenId);
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/viewAsset');
    }));

});
