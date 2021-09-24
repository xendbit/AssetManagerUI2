import { Component, OnInit } from '@angular/core';
import { IBlogGroup } from '../../interfaces/blog/blog.interfaces';
import { IArtwork, IPresentation } from '../../interfaces/presentation/presentation.interface';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slide: IPresentation;
  blogs: IBlogGroup;
  artworks: any;
  constructor(public mainService: MainService) { }

  ngOnInit() {
    this.mainService.getArtWork().subscribe((data: IArtwork) => {
      this.artworks = data;
    })
   this.mainService.getBlogPost().subscribe((data: IBlogGroup) => {
     this.blogs = data;
     this.artworks = data;
     
   })

 
  
  }

}
