import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {CoreModule} from '../core/core.module';

import { CuratorsOfTheWeekComponent } from './curators-of-the-week/curators-of-the-week.component';
import { PopularArtistsComponent } from './popular-artists/popular-artists.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShoreComponent } from './shore/shore.component';
import { CuratorCardComponent } from './curator-card/curator-card.component';


@NgModule({
  declarations: [
    ShoreComponent,
    CuratorsOfTheWeekComponent,
    PopularArtistsComponent,
    CuratorCardComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    PublicRoutingModule,
  ],
  exports: [
  ]
})
export class PublicModule { }
