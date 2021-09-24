import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, NgZone  } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IArtwork } from '../../interfaces/presentation/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-assets-grid',
  templateUrl: './assets-grid.component.html',
  styleUrls: ['./assets-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AssetsGridComponent implements OnInit {
  artworks: IArtwork;
  work: any [];
  @Input() public artworkArray: IArtwork [];

  constructor(public mainService: MainService, private ngZone: NgZone) { }

  ngOnInit() {
    // this.mainService.getArtWork().subscribe(data => {
    //   this.artworky = data;
    //   console.log('this is ', this.artworky)
    this.ngZone.run( data => {
      this.mainService.getArtWorkFromMain(1, 10).pipe().subscribe(res => {
        this.artworks = res;
      })
    })
    
  }
  

  byId(index, item) {
    return item.id;
  }

  Next(page, count) {

    page = page + 1;
    this.mainService.getArtWorkFromMain(page, count).pipe(tap (data => {
      this.artworks = data;
    }));
  }

  Prev(page, count, totalPages) {
    if (page > totalPages) {
      page = totalPages;
      this.mainService.getArtWorkFromMain(page, count).pipe(tap (data => {
        this.artworks = data;
      }));
    } else {
      page = page - 1;
      this.mainService.getArtWorkFromMain(page, count).pipe(tap (data => {
        this.artworks = data;
      }));
    }

   
  }

}
