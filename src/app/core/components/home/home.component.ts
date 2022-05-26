import { AuctionService } from './../../services/auction.service';
import { Component, OnInit } from '@angular/core';
import { IBlogGroup } from '../blog/blog.interfaces';
import { IArtwork, IPresentation } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  presentationData: any;

  transitions = '150ms cubic-bezier(0, 0, 0.2, 1)';

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  constructor(public mainService: MainService,
     public auctionService: AuctionService, 
     private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.ngxService.start();
    this.mainService.returnArtwork().subscribe((data: IArtwork []) => {
      if (data !== null) {
        this.artworks = data;
      }
    }, err => {
      console.log('artwork error =>', err)
      this.ngxService.stop();
    });
    this.mainService.getPresentation().subscribe(async (res: any) => {
      this.slide = await res;
    }, err => {
      console.log('presentation error =>', err)
      this.ngxService.stop();
    });
    this.mainService.getDrops().subscribe(async (res: any) => {
      if (res !== null) {
        this.presentationData = await res;
      }
    }, err => {
      console.log('Drops error => ', err);
      this.ngxService.stop();
    })
    this.mainService.getBlogPost().subscribe((data: IBlogGroup) => {
      this.blogs = data;
      this.ngxService.stop();
    }, err => {
      console.log('blog error =>', err);
      this.ngxService.stop();
    });
  }



}
