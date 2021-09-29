import { ICategory } from './category.interface';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IArtwork } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  artworks: IArtwork [];
  responsiveOptions;
  unsold: any;
  categories:  ICategory [] = [
    {id: 1, title:"Artwork"},
    {id: 2, title: "Music Rights"}, 
    {id: 2, title: "Movie Rights"}
  ];
  musicRights: IArtwork[];
  movieRights: IArtwork[];
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
    this.mainService.returnArtwork().subscribe(async data => {
      this.artworks = data;
    })
  }

  async categoryFilter() {
    this.musicRights = await this.artworks.filter(item => {
      return item.category === 'musicRight';
    });

    this.movieRights = await this.artworks.filter(item => {
      return item.category === 'movieRight';
    });
  }

  sort(data) { //to be implemented for sort by date when we implement the sort feature
    let today = Date.now();
    this. artworks = data.sort((a, b) => today - new Date(data.dateIssued * 1000).getTime());
  }

  filterArtworks(data) { //to be implemented for filter when we implement the filter feature
    this.unsold = data.filter((res: IArtwork) =>res['sold'] === false);
  }

}
