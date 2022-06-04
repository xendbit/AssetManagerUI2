import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SubscribeService {

  mailChimpEndpoint = 'https://gmail.us6.list-manage.com/subscribe/post?u=8dfd1d931f2b0f3e33e53978a&amp;id=22882c8fde';

  constructor(private http: HttpClient) {
  }

  subscribeToList(data) {
    const params = new HttpParams()
      .set('EMAIL', data.email)
      .set('b_8dfd1d931f2b0f3e33e53978a_22882c8fde', '');
    console.log(params);
    const mailChimpUrl = `${this.mailChimpEndpoint}&${params.toString()}`;
    return this.http.jsonp(mailChimpUrl, 'c');
  }

}
