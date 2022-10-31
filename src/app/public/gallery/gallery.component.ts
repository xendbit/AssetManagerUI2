import { Component, OnInit } from '@angular/core';
import {MainService} from '../../core/services/main.service';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  galleries: any[]
  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.getGalleries();
  }

  getGalleries() {
    this.mainService.fetchArtists('gallery', 1, 6)
      .subscribe((response: any) => {
        this.galleries = response.data?.items;
      }, error => {
        console.log(error);
    });
  }

}
