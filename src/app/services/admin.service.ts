import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public httpClient: HttpClient) { }
  baseUrl = 'http://35.224.252.52:8080/v3';
  api_key = 'U2FsdGVkX1+vWiwDTm34FGo/7oGjQm8i9DyJaJLiLRymoXyJczo8iOqriHWOMiSCZN2hSBBkr5V5R0BG2lMDLojEh0bvJcZzg3uiQKeve5E=';


  registerAdmin(body) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    console.log('this is headers', headers);
    console.log('this is body', body);
    return this.httpClient.post(`${this.baseUrl}/user/new-user`, body, {headers});
  }

  approve(tokenId, status:boolean) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    return this.httpClient.post(`${this.baseUrl}/admin/change-approval-status/${tokenId}/${status}`, {headers});
  }

  login(email, password) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('api-key', this.api_key);
    console.log('this is base url', this.baseUrl);
    return this.httpClient.post(`${this.baseUrl}/admin/login`, {email, password}, {headers});
  }


}
