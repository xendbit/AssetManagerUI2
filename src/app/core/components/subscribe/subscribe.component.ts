import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {SubscribeService} from './subscribe.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeComponent implements OnInit {

  subscribeData: any = <any>{};

  constructor(private subscribeService: SubscribeService) { }

  ngOnInit() {
  }

  subscribe(subscribeForm: NgForm) {
    console.log("want to sub");
    if (subscribeForm.invalid) {
      return;
    }
    this.subscribeService.subscribeToList(this.subscribeData)
      .subscribe(res => {
        alert('Subscribed!');
      }, err => {
        console.log(err);
      })

  }
}
