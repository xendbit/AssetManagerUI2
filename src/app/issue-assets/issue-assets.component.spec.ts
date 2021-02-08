import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';
import { of, Subject } from 'rxjs';

import { IssueAssetsComponent } from './issue-assets.component';

describe('IssueAssetsComponent', () => {
    let component: IssueAssetsComponent;
    let fixture: ComponentFixture<IssueAssetsComponent>;
    let assetService: AssetsService;
    let fb: FormBuilder;
    let assetFormGroup: FormGroup;
    let router: Router;

    // let spy = jasmine.createSpyObj(AssetsService, ['getAllAssets']); 


    const activatedRouteStub = {
        paramMap: of({ abc: 'testABC' })
    }

    const routeStub = {
        navigateByUrl(url: string) { return url; }
    }



    // this.form = fb.group({
    //     'description': this.description,
    //     'symbol': this.symbol,
    //     'issuingPrice': this.issuingPrice,
    //     'image': this.image,
    //     'totalSupply': this.totalSupply,
    //     'artTitle': this.title,
    //     'artistName': this.artist,
    //     'availableShares': this.shares
    // });

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientModule, HttpClientTestingModule, BrowserAnimationsModule,
                    ReactiveFormsModule,
                    FormsModule],
                declarations: [IssueAssetsComponent],
                providers: [
                    AssetsService,
                    { provide: Router, useValue: routeStub },
                    {
                        provide: ActivatedRoute,
                        useValue: activatedRouteStub
                    }, FormBuilder
                ]
            }).compileComponents();
            assetService = TestBed.inject(AssetsService);
            router = TestBed.inject(Router);
            fb = TestBed.inject(FormBuilder);
        })
    );

    beforeEach(() => {
        // history.pushState({ from: 'home' }, '', '');
        fixture = TestBed.createComponent(IssueAssetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        assetFormGroup = fb.group({
            'description': [''],
            'symbol': [''],
            'issuingPrice': [''],
            'image': [''],
            'totalSupply': [''],
            'artTitle': [''],
            'artistName': [''],
            'availableShares': [''],
        });
    });

    it('should create issue assets components', () => {
        expect(component).toBeTruthy();
    });

    it('should call getUserAssets() function, showspinner, set global variables and hidespinner ', () => {
        const showSpinnerSpy = spyOn(assetService, 'showSpinner');
        const hideSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const userId = '12';
        // const localStorageUserId = spyOn(localStorage, 'getItem').withArgs(userId);
        const mockAssets = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }], "meta": { "totalItems": "3" } } };
        spyOn(assetService, 'getAssetsByIssuerId').and.returnValue(of(mockAssets));
        component.ngOnInit();
        expect(component.image === '/assets/img/nse.png');
        expect(showSpinnerSpy).toHaveBeenCalled();
        // expect(localStorageUserId).toBeDefined();
        component.getUserAssets();
        expect(component.assets).toBeDefined();
        expect(component.totalItems).toBeDefined();
        expect(component.totalApproved).toBeDefined();
        expect(hideSpinnerSpy).toHaveBeenCalled();
    });

    it('should call submit() and assert the form values variables and navigate to issuer dashboard', waitForAsync(() => {
        const mockBody = {
            description: 'description',
            symbol: 'symbol',
            totalSupply: 'supply',
            issuingPrice: 'price',
            issuerId: 'issueId',
            artistName: 'artist',
            titleOfWork: 'title',
            image: 'image',
            sharesAvailable: 'shares',
            commission: 500,
            price: 'issuePrice',
            createdOn: new Date().getTime(),
            nameOfOwners: "null"
        }
        const mockReturn = { "status": "success", "data": { "items": [{ "tokenId": 86988662, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }, { "tokenId": 70764050, "issuer": "0x63e323075454164a0e3483a50650b2f6fae7afed" }], "meta": { "totalItems": "3" } } };
        spyOn(assetService, 'issue').and.returnValue(of(mockReturn));
        const showSpinnerSpy = spyOn(assetService, 'showSpinner');
        const stopSpinnerSpy = spyOn(assetService, 'stopSpinner');
        const showNotification = spyOn(assetService, 'showNotification');
        const routeSpy = spyOn(router, 'navigateByUrl')
        component.submit();
        expect(showSpinnerSpy).toHaveBeenCalled();
        expect(stopSpinnerSpy).toHaveBeenCalled();
        expect(mockReturn['status']).toBeDefined();
        expect(showNotification).toHaveBeenCalled();

        expect(routeSpy).toHaveBeenCalled();
        const navArgs = routeSpy.calls.first().args[0];
        expect(navArgs).toBe('/issuer-dashboard');
    }));

    it('should call uploadFile(), check if the format is not an image and upload', waitForAsync(() => {
        const event = {
            target: {
                files: [{ name: "test.html" }, { name: "test2.html" }]
            },
            srcElement: {
                value: null
            }
        }
        const showNotification = spyOn(assetService, 'showNotification');
        let mockFileReader = {
            result: '',
            readAsDataURL: (blobInput) => {
                console.log('readAsDataURL');
            },
            onloadend: () => {
                console.log('onloadend');
            }
        };
        const fileReaderObj = spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
        const fileReaderAction = spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake((blobInput) => {
            mockFileReader.result = '';
            mockFileReader.onloadend();
        });

        component.uploadFile(event);
        expect(/\.(jpe?g|gif|png)$/i.test(event.target.files[0].name)).toBeFalsy();
        expect(showNotification).toHaveBeenCalled();
        expect(event.srcElement.value).toEqual(null);
        expect(fileReaderObj).toHaveBeenCalled();
        expect(fileReaderAction).toHaveBeenCalled();
    }));

    it('should call uploadFile(), check if the format is an image and upload', waitForAsync(() => {
        const event = {
            target: {
                files: [{ name: "test.jpg" }, { name: "test2.jpg" }]
            },
            srcElement: {
                value: null
            }
        }
        let mockFileReader = {
            result: '',
            readAsDataURL: (blobInput) => {
                console.log('readAsDataURL');
            },
            onloadend: () => {
                console.log('onloadend');
            }
        };
        const fileReaderObj = spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
        const fileReaderAction = spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake((blobInput) => {
            mockFileReader.result = '';
            mockFileReader.onloadend();
        });

        component.uploadFile(event);
        expect(/\.(jpe?g|gif|png)$/i.test(event.target.files[0].name)).toBeTruthy();
        expect(fileReaderObj).toHaveBeenCalled();
        expect(fileReaderAction).toHaveBeenCalled();
    }));



})
