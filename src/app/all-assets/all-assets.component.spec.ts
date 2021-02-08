import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
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
        navigateByUrl(url: string) { return url; }
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

            history.pushState({ from: 'home' }, '', '');
            fixture = TestBed.createComponent(AllAssetsComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        })
    );

    // beforeEach(waitForAsync(() => {

    // }));

    it('should create all assets components', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('should initialize if history is set', waitForAsync(() => {
        // delete (window as any).history;
        // const history = {
        //   state: {
        //     from: "home"
        //   }
        // };
        // Object.defineProperty(window, "history", {
        //   configurable: true,
        //   enumerable: true,
        //   value: history,
        //   writable: true
        // });
        component.ngOnInit();
        // tick(500);
        expect(component.pageHistory).toEqual(history.state.from);
        // flush();
    }));

    it('should initialize if history is not set', waitForAsync(() => {
        // delete (window as any).history;
        // const history = {
        //   state: {
        //     from: null
        //   }
        // };
        // Object.defineProperty(window, "history", {
        //   configurable: true,
        //   enumerable: true,
        //   value: history,
        //   writable: true
        // });
        history.pushState({ from: null }, '', '');
        component.ngOnInit();
        // tick(500);
        expect(component.pageHistory).toEqual('buyPage');
        // flush();
    }));

    it('should get all assets and check that all variables are initialized', waitForAsync(() => {
        const mockAssets = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }] } };
        spyOn(assetService, 'getAllAssets').and.returnValue(of(mockAssets));
        const showSpinnerSpy = spyOn(assetService, 'showSpinner');
        const stopSpinnerSpy = spyOn(assetService, 'stopSpinner');
        component.getAssets();
        // tick(500);
        expect(component.assets).toBeDefined();
        expect(showSpinnerSpy).toHaveBeenCalled();
        expect(stopSpinnerSpy).toHaveBeenCalled();
        expect(component.primaryMarket).toBeInstanceOf(Array);
        expect(component.secondaryMarket).toBeInstanceOf(Array);
        // flush();
    }));

    it('it should assert market 0 and navigate to view assets page', waitForAsync(() => {
        const tokenId = 'tokenId';
        const market = 0;
        // component.pageHistory='primary';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.view(tokenId, market);
        // tick(500);
        expect(component.pageHistory).toBeDefined();
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/viewAsset');
        // flush();
    }));

    it('it should assert market 1 and navigate to asset order page', waitForAsync(() => {
        const tokenId = 'tokenId';
        const market = 1;
        // component.pageHistory='secondary';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.view(tokenId, market);
        // tick(500);
        expect(component.pageHistory).toBeDefined();
        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/asset-order');
        // flush();
    }));

    it('it should take in the token id as parameter and navigate to asset order page', waitForAsync(() => {
        // routeSpyStub = spyOn(routerObj,'navigateByUrl');
        const tokenId = 'tokenId';
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.viewOrder(tokenId);
        // tick(500);
        // expect(routeSpy).toHaveBeenCalledWith('/asset-order');

        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/asset-order');
        // flush();
    }));

});
