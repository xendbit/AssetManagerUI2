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
  @Input() public artworkArray: IArtwork [];
  unsold: any;
  categories: string [];
  constructor(public mainService: MainService, private spinner: NgxSpinnerService) { 
 
  }

  ngOnInit(){
    //after push from parent assign to this.artworks
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artworkArray']) {
        if (this.artworkArray !== undefined) {
          this.categories = this.artworkArray.map(item => item.category)
          .filter((value, index, self) => self.indexOf(value) === index);
        }
    }
    
  }

  categoryFilter(category) {
    this.artworkArray = this.artworkArray.filter(item => {
      return item.category === category;
    });
  }

  sort(data) { //to be implemented for sort by date when we implement the sort feature
    let today = Date.now();
    this. artworkArray = data.sort((a, b) => today - new Date(data.dateIssued * 1000).getTime());
  }

  filterArtworks(data) { //to be implemented for filter when we implement the filter feature
    this.unsold = data.filter((res: IArtwork) =>res['sold'] === false);
  }

}
