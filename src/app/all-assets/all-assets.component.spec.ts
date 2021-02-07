import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AssetsService } from '../services/assets.service';
import { of, Subject } from 'rxjs';

import { AllAssetsComponent } from './all-assets.component';

describe('AllAssetsComponent', () => {
    let component: AllAssetsComponent;
    let fixture: ComponentFixture<AllAssetsComponent>;
    let assetService: AssetsService;
    let router: Router;
    // // let routeSpyStub;
    // let testUrl = '';


    let spy = jasmine.createSpyObj(AssetsService, ['getAllAssets']);


    const activatedRouteStub = {
        paramMap: of({ abc: 'testABC' })
    }

    const routeStub = {
        navigateByUrl(url:string){return url;}
    }


    beforeEach(
        waitForAsync(() => {
            // routeSpyStub = spyOn(routerObj,'navigateByUrl');


            TestBed.configureTestingModule({
                imports: [HttpClientModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])],
                declarations: [AllAssetsComponent],
                providers: [
                    AssetsService,
                    // Router,
                    { provide: Router, useValue: routeStub },
                    // { provide: Router, useValue: routeSpyStub },
                    {
                        provide: ActivatedRoute,
                        useValue: activatedRouteStub
                    }
                ]
            }).compileComponents();
            assetService = TestBed.inject(AssetsService);
            router = TestBed.inject(Router);
            // routerObj = TestBed.inject(Router);
            // routeSpyStub = jasmine.createSpyObj('Router', ['navigateByUrl']);
        })
    );

    beforeEach(() => {

        history.pushState({ from: 'home' }, '', '');
        fixture = TestBed.createComponent(AllAssetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create all assets components', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize if history is set', () => {
        component.ngOnInit();
        expect(component.pageHistory).toEqual(history.state.from);
    });

    it('should initialize if history is not set', () => {
        history.state.from = null;
        component.ngOnInit();
        expect(component.pageHistory).toEqual('buyPage');
    });

    it('should get all assets and check that all variables are initialized', fakeAsync(() => {
        const mockAssets = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }] } };
        spyOn(assetService, 'getAllAssets').and.returnValue(of(mockAssets));
        const showSpinnerSpy = spyOn(assetService,'showSpinner');
        const stopSpinnerSpy = spyOn(assetService,'stopSpinner');
        component.getAssets();
        expect(component.assets).toBeDefined();
        expect(showSpinnerSpy).toHaveBeenCalled();
        expect(stopSpinnerSpy).toHaveBeenCalled();
        expect(component.primaryMarket).toBeInstanceOf(Array);
        expect(component.secondaryMarket).toBeInstanceOf(Array); 
    }));

    it('it should assert market 0 and navigate to view assets page', waitForAsync(() => {
        const tokenId='tokenId';
        const market = 0;
        // component.pageHistory='primary';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.view(tokenId,market);
        expect(component.pageHistory).toBeDefined();
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/viewAsset');
    }));

    it('it should assert market 1 and navigate to asset order page', waitForAsync(()=>{
        const tokenId='tokenId';
        const market = 1;
        // component.pageHistory='secondary';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.view(tokenId,market);
        expect(component.pageHistory).toBeDefined();
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/asset-order');
    }));

    it('it should take in the token id as parameter and navigate to asset order page', waitForAsync(()=>{
        // routeSpyStub = spyOn(routerObj,'navigateByUrl');
        const tokenId='tokenId';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.viewOrder(tokenId);
        // expect(routeSpy).toHaveBeenCalledWith('/asset-order');

        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/asset-order');
    }));

});
