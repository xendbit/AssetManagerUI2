import { Component, OnInit } from '@angular/core';
import { IBlogGroup } from '../blog/blog.interfaces';
import { IArtwork, IPresentation } from '../slider/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slide: IPresentation;
  blogs: IBlogGroup;
  artworks: IArtwork[];
  categoryToIds: Map<string, Array<number> >
  constructor(public mainService: MainService) { }

  ngOnInit() {
    this.mainService.returnArtwork().subscribe(data => {
      this.artworks = data;
    })
   this.mainService.getBlogPost().subscribe((data: IBlogGroup) => {
     this.blogs = data;
   })

  //  console.log('dfdf',this.mainService.fetchSingleArtwork(710246))
  this.mainService.fetchSingleArtwork(710246).subscribe(res => {
    console.log('this is ', res)
  })
  
  }

}
