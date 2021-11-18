import { AuctionService } from './../../services/auction.service';
import { Component, OnInit } from '@angular/core';
import { IBlogGroup } from '../blog/blog.interfaces';
import { IArtwork, IPresentation } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slide: IPresentation;
  blogs: IBlogGroup;
  artworks: IArtwork [];
  categoryToIds: Map<string, Array<number> >
  constructor(public mainService: MainService, public auctionService: AuctionService) { }

  ngOnInit() {
    this.mainService.getPresentation().subscribe((res: IPresentation) => {
      this.slide = res;
    })
    this.mainService.returnArtwork().subscribe((data: IArtwork []) => {
      this.artworks = data;
    })

    //forkJoin([this.mainService.returnArtwork(), this.auctionService.fetchAuctionFromMain()]).subscribe(results => {
      // results[0] is for list of artworks
      // results[1] is supposed to be for auction response
    //});
    this.mainService.getBlogPost().subscribe((data: IBlogGroup) => {
      this.blogs = data;
    })
   // do an object compare on the mainService calls before calling preloader after first call
  
  
  }

 

}
