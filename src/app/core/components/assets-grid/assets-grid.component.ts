import { Component, OnInit, Input, OnChanges, NgZone,  SimpleChanges  } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IArtwork } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-assets-grid',
  templateUrl: './assets-grid.component.html',
  styleUrls: ['./assets-grid.component.scss'],

})
export class AssetsGridComponent implements OnInit {
  artworks: IArtwork [];
  work: any [];
  @Input() public artworkArray: IArtwork [];
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;

  constructor(public mainService: MainService, private ngZone: NgZone) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artworkArray']) {
      this.artworks = this.artworkArray //after push from parent assign to this.artworks
    }
    this.mainService.getMeta().subscribe(res => {
      if (res !== null) {
        this.currentPage = res.currentPage;
        this.itemCount = res.itemCount;
        this.itemsPerPage = res.itemsPerPage
        this.totalItems = res.totalItems
        this.totalPages = res.totalPages
      }
    })
    
  }

  ngOnDestroy() {
    this.mainService.getMeta().unsubscribe();
    this.mainService.returnArtwork().unsubscribe();
  }
  

  byId(index, item) {
    return item.id;
  }

  loadMore(page, count) {
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchArtWorkFromMain(this.currentPage, this.itemCount);
  }

}
