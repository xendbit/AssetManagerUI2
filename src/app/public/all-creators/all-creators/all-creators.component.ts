import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/core/services/main.service';
@Component({
  selector: 'app-all-creators',
  templateUrl: './all-creators.component.html',
  styleUrls: ['./all-creators.component.scss']
})
export class AllCreatorsComponent implements OnInit {

  creators: any[] = [];

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.getCreators();
  }

  getCreators() {
    this.mainService.fetchArtists('creator', 1, 100)
      .subscribe((response: any) => {
        this.creators = response.data?.items;
        // console.log(response.data.items)
      }, error => {
        console.log(error);
    });
  }

}
