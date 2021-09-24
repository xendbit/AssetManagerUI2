import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { SliderComponent } from './components/slider/slider.component';
import { NFTCardComponent } from './components/nftcard/nftcard.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import {CarouselModule} from 'primeng/carousel';
import {DataViewModule} from 'primeng/dataview';
import { BlogComponent } from './components/blog/blog.component';
import { AssetsGridComponent } from './components/assets-grid/assets-grid.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    DataViewModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    SubscribeComponent,
    SliderComponent,
    NFTCardComponent,
    CarouselComponent,
    BlogComponent,
    AssetsGridComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    SubscribeComponent,
    SliderComponent,
    NFTCardComponent,
    CarouselComponent,
    BlogComponent,
    AssetsGridComponent
  ]
})
export class CoreModule {
}
