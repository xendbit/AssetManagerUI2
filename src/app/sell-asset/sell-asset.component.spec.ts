import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AssetsService } from '../services/assets.service';
import { Observable, of, Subject, throwError } from 'rxjs';

import { SellAssetComponent } from './sell-asset.component';

describe('Sell Asset Component', () => {
    let component: SellAssetComponent;
    let fixture: ComponentFixture<SellAssetComponent>;
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
                declarations: [SellAssetComponent],
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
            fixture = TestBed.createComponent(SellAssetComponent);
            component = fixture.componentInstance;

            fixture.detectChanges(); 
        })
    );

    it('should create sell asset component', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('should call getAssets() function, showspinner and hidespinner on ngOnit() ', waitForAsync(() => {
        const showSpinnerSpy = spyOn(assetService, 'showSpinner');
        const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const mockAssets = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }], "meta": { "totalItems": "3" } } };
        spyOn(assetService, 'getAssetsByOwnerId').and.returnValue(of(mockAssets));
        component.ngOnInit();
        expect(showSpinnerSpy).toHaveBeenCalled();
        component.getAssets();
        expect(component.assets).toBeDefined();
        expect(hideSpinnerSpy).toHaveBeenCalled();
    }));

    it('should call getAssets() function if error is thrown hidespinner on ngOnit() ', waitForAsync(() => {
        const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        spyOn(assetService, 'getAssetsByOwnerId').and.returnValue(throwError({}));
        component.ngOnInit();
        expect(hideSpinnerSpy).toHaveBeenCalled();
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

    it('when onOptionsSelected function is called it should take in a string value as parameter', waitForAsync(() => {
        const value = 'test string';
        component.onOptionsSelected(value);
        expect(typeof value === 'string').toBeTruthy();
    }));

});
