import { Component, OnInit } from '@angular/core';
import {MainService} from '../../core/services/main.service';

@Component({
  selector: 'app-curators-of-the-week',
  templateUrl: './curators-of-the-week.component.html',
  styleUrls: ['./curators-of-the-week.component.scss']
})
export class CuratorsOfTheWeekComponent implements OnInit {
  collectors: [] = [];
  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.fetchArtists('collector', 1, 6)
      .subscribe((response: any) => {
        this.collectors = response.data?.items;
        console.log(this.collectors)
      }, error => {
        console.log(error);
      });
  }

}
