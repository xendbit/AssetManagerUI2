import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http'
import { AssetsService } from './assets.service';

describe('AssetsService', () => {
    let service: AssetsService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const baseUrl = 'http://35.224.252.52:8080/v3';
    const api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';

    beforeEach(() => {

        //Configures testing app module
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                AssetsService,
            ]
        });

        //Instantaites HttpClient, HttpTestingController and AssetsService
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AssetsService);

    });

    afterEach(() => {
        httpTestingController.verify(); //Verifies that no requests are outstanding.
    });

    describe('#assetsServiceFunctions', () => {

        it('should check the assets service has be created', () => {
            expect(service).toBeTruthy();
        });



        //Test case 1
        it('should make a GET API request for listing', () => {
            service.listing().subscribe((list) => {
                // console.log("list ",list);
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/listings`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 2
        it('should make a POST API call to issue an asset with body object', () => {
            const postMockObj = {};
            service.issue(postMockObj).subscribe((result) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/issue-asset`);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(postMockObj);
            req.flush(postMockObj);
        });

        //Test case 3
        it('should make a GET API request for users', () => {
            service.getUsers().subscribe((transfers) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/users`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 4
        it('should make a GET API request for transfers', () => {
            service.transfers().subscribe((transfers) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/transfers`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 5
        it('should make a GET API request for all assets', () => {
            service.getAllAssets().subscribe((transfers) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets?page=1&limit=100`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 6
        it('should make a GET API request for asset by issuer', () => {
            const userId = 5;
            service.getAssetsByIssuerId(userId).subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/by-issuer/${userId}?page=${1}&limit=15`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 7
        it('should make a GET API request for asset by owner id', () => {
            const userId = 5;
            service.getAssetsByOwnerId(userId).subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/by-owner/${userId}?page=${1}&limit=15`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 8
        it('should make a GET API request for asset by token id', () => {
            const tokenId = 5;
            service.getAssetsByTokenId(tokenId).subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/by-token-id/${tokenId}`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 9
        it('should make a GET API request for wallet balance', () => {
            const userId = 5;
            service.getWaletBalance(userId).subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/user/wallet-balance/${userId}`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 10
        it('should make a POST API call to buy an asset with body object', () => {
            const postMockObj = {};
            service.buyAsset(postMockObj).subscribe((result) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/new-order`);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(postMockObj);
            req.flush(postMockObj);
        });

        //Test case 11
        it('should make a POST API call to sell an asset with body object', () => {
            const postMockObj = {};
            service.buyAsset(postMockObj).subscribe((result) => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/new-order`);
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(postMockObj);
            req.flush(postMockObj);
        });

        //Test case 12
        it('should make a GET API request to get all orders', () => {
            const userId = 5;
            service.allOrders().subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/orders?page=1&limit=50`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 13
        it('should make a GET API request to get orders by buyer id', () => {
            const buyerId = 5;
            service.ordersByBuyer(buyerId).subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/orders/by-buyer/${buyerId}?page=1&limit=50`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 14
        it('should make a GET API request to get orders by seller id', () => {
            const sellerId = 5;
            service.ordersBySeller(sellerId).subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/orders/by-seller/${sellerId}?page=1&limit=50`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 15
        it('should make a GET API request to get orders by token id', () => {
            const tokenId = 5;
            service.ordersByTokenId(tokenId).subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/assets/orders/by-token-id/${tokenId}?page=1&limit=50`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });

        //Test case 16
        it('should make a GET API request to get passphrase', () => {
            service.getPassphrase().subscribe(() => {
            });
            const req = httpTestingController.expectOne(`${baseUrl}/user/generate/passphrase`);
            console.log("req ", req);

            expect(req.request.method).toEqual('GET');
            expect(req.request.responseType).toEqual('json');
            req.flush({}); //Return expected object
        });


        // //Test case 3
        // it('should make a POST API call to get a password reset token with a body object', () => {
        //     const postMockObj = {};
        //     service.requestToken(postMockObj).subscribe((token) => {
        //     });
        //     const req = httpTestingController.expectOne(`${baseUrl}/user/request-password-reset-token`);
        //     expect(req.request.method).toEqual('POST');
        //     expect(req.request.body).toEqual(postMockObj);
        //     req.flush(postMockObj);
        // });

        // //Test case 4
        // it('should make a POST API call to change password with a body object', () => {
        //     const postMockObj = {};
        //     service.changePassword(postMockObj).subscribe((token) => {
        //     });
        //     const req = httpTestingController.expectOne(`${baseUrl}/user/change-password`);
        //     expect(req.request.method).toEqual('POST');
        //     expect(req.request.body).toEqual(postMockObj);
        //     req.flush(postMockObj);
        // });

        // //Test case 5
        // it('should make a POST request to approve a user, check the tokenID and status parameters are in the url', () => {
        //     const boolStatus = true;
        //     const tokenId = 'testtokenID123';
        //     service.approve(tokenId, boolStatus).subscribe((admin) => {
        //     });
        //     const req = httpTestingController.expectOne(`${baseUrl}/admin/change-approval-status/${tokenId}/${boolStatus}`);
        //     console.log("check the req ", req);
        //     expect(req.request.url).toContain(tokenId);
        //     expect(req.request.url).toContain(boolStatus.toString());
        //     req.flush({});
        // });

    });


});