import { Component, OnInit } from '@angular/core';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  artworks: IArtwork [];

  constructor(public mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.returnArtwork().subscribe((data: IArtwork []) => {
      this.artworks = data;
    })
  }

}
