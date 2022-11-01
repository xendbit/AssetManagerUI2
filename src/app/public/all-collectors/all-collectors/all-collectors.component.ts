import { Component, OnInit } from '@angular/core';
import collectors from './all-collectors.json';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  selector: 'app-all-collectors',
  templateUrl: './all-collectors.component.html',
  styleUrls: ['./all-collectors.component.scss']
})
export class AllCollectorsComponent implements OnInit {

  collectors: any[] = [];

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.getCollectors();
  }

  getCollectors() {
    this.mainService.fetchArtists('collector', 1, 100)
      .subscribe((response: any) => {
        this.collectors = response.data?.items;
      }, error => {
        console.log(error);
    });
  }

}
