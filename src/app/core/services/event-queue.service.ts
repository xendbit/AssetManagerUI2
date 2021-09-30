import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { filter } from 'rxjs/internal/operators/filter';
import { Subject } from 'rxjs/internal/Subject';
import { AppEvent, AppEventType } from '../components/nftcard/nftEnum.type';

@Injectable({
  providedIn: 'root'
})
export class EventQueueService {
  private eventBrocker = new Subject<AppEvent<any>>();
  constructor() { }

  on(eventType: AppEventType): Observable<AppEvent<any>> {
    return this.eventBrocker.pipe(filter(event => event.type === eventType));
  }

  dispatch<T>(event: AppEvent<T>): void {
    this.eventBrocker.next(event);
  }
  
}
