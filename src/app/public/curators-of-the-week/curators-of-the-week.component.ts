import { Component, OnInit } from '@angular/core';
import {MainService} from '../../core/services/main.service';

@Component({
  selector: 'app-curators-of-the-week',
  templateUrl: './curators-of-the-week.component.html',
  styleUrls: ['./curators-of-the-week.component.scss']
})
export class CuratorsOfTheWeekComponent implements OnInit {

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.fetchArtists('artists', 1, 6)
      .subscribe((response: any) => {
        console.log(response.data?.items);
        console.log('ARTISTS', response);
      }, error => {
        console.log(error);
      });
  }

}
