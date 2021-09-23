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

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    SubscribeComponent,
    SliderComponent,
    NFTCardComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    SubscribeComponent,
    SliderComponent,
    NFTCardComponent
  ]
})
export class CoreModule {
}
