import { Component, OnInit } from '@angular/core';
import {MainService} from '../../core/services/main.service';

@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrls: ['./collectors.component.scss']
})
export class CollectorsComponent implements OnInit {
  collectors: any[] = [];
  constructor(
    private mainService: MainService
    ) { }

  ngOnInit(): void {
      this.getCollectors();
  }

  getCollectors() {
    this.mainService.fetchArtists('collector', 1, 6)
      .subscribe((response: any) => {
        this.collectors = response.data?.items;
      }, error => {
        console.log(error);
    });
  }

}
