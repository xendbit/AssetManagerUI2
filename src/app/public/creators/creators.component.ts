import { Component, OnInit } from '@angular/core';
import {MainService} from '../../core/services/main.service';

@Component({
  selector: 'app-creators',
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {

  creators: any[];

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    // this.creators = myCreators;
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
