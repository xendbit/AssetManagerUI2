import { NgxSpinnerService } from 'ngx-spinner';

import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IArtwork } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  artworks: IArtwork [];
  @Input() public artworkArray: IArtwork [];
  responsiveOptions;
  unsold: any;
  categories: string [];
  musicRights: IArtwork[];
  movieRights: IArtwork[];
  constructor(public mainService: MainService, private spinner: NgxSpinnerService) { 
 
  }

  ngOnInit(){

  }

  ngOnChanges(changes: SimpleChanges) {
    this.spinner.show();
    if (changes['artworkArray']) {
        if (this.artworkArray !== null) {
          this.artworks = this.artworkArray //after push from parent assign to this.artworks
          this.spinner.hide();
          this.categories = this.artworks.map(item => item.category)
          .filter((value, index, self) => self.indexOf(value) === index);
        }
    }
    
  }

  categoryFilter(category) {
    this.artworks = this.artworks.filter(item => {
      return item.category === category;
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
