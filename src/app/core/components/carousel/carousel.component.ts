import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IArtwork } from '../../interfaces/presentation/presentation.interface';
import { MainService } from '../../services/main.service';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  artworks: IArtwork;
  msgToSlider: IArtwork;
  responsiveOptions;
  constructor(public mainService: MainService) { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }

  ngOnInit(){
    this.mainService.getArtWork().subscribe(data => {
      this.artworks = data;
    })
    console.log('this is artworks', this.artworks)
  }

  sort(data) {
    data.sort((a, b) => new Date(b.CREATE_TS).getTime() - new Date(a.CREATE_TS).getTime());
  }

}
