import { Component, OnInit } from '@angular/core';
import gallery from './gallery.json'
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  galleries: any[]
  constructor() { }

  ngOnInit(): void {
    this.galleries = gallery;
  }

}
