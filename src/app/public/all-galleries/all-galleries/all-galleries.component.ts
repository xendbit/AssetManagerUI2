import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  selector: 'app-all-galleries',
  templateUrl: './all-galleries.component.html',
  styleUrls: ['./all-galleries.component.scss']
})
export class AllGalleriesComponent implements OnInit {

  galleries: any[] = [];

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.getGalleries();
  }

  getGalleries() {
    this.mainService.fetchArtists('gallery', 1, 100)
      .subscribe((response: any) => {
        this.galleries = response.data?.items;
        console.log(this.galleries);
      }, error => {
        console.log(error);
    });
  }

}
