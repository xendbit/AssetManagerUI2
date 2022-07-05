import { Component, OnInit } from '@angular/core';
import {IPresentation, IArtwork} from '../../core/components/slider/presentation.interface';
import {MainService} from '../../core/services/main.service';

@Component({
  selector: 'app-shore',
  templateUrl: './shore.component.html',
  styleUrls: ['./shore.component.scss']
})
export class ShoreComponent implements OnInit {
  slide: IPresentation;
  artworks: IArtwork [];
  constructor(public mainService: MainService,) { }

  ngOnInit(): void {
    this.mainService.returnArtwork().subscribe((data: IArtwork []) => {
      if (data !== null) {
        this.artworks = data;
      }
    }, err => {
      console.log('artwork error =>', err)
    });
    this.mainService.getPresentation().subscribe((res: IPresentation) => {
      this.slide = res;
    });
  }

}
