import { Component, OnInit } from '@angular/core';
import {MainService} from '../../core/services/main.service';
import myCollectors from './collectors.json';

@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrls: ['./collectors.component.scss']
})
export class CollectorsComponent implements OnInit {
  collectors: any[] = [];
  constructor(private mainService: MainService) { }

  ngOnInit(): void {
      this.collectors = myCollectors;
  }

  getCollectors() {
    this.mainService.fetchArtists('collector', 1, 6)
      .subscribe((response: any) => {
        this.collectors = response.data?.items;
        console.log(this.collectors)
      }, error => {
        console.log(error);
      });
  }

}
