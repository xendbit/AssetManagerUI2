import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {AngularTiltModule} from 'angular-tilt';
import {CoreModule} from '../core/core.module';

import { CuratorsOfTheWeekComponent } from './curators-of-the-week/curators-of-the-week.component';
import { HeroComponent } from './hero/hero.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShoreComponent } from './shore/shore.component';
import { PopularArtistsComponent } from './popular-artists/popular-artists.component';


@NgModule({
  declarations: [
    ShoreComponent,
    CuratorsOfTheWeekComponent,
    PopularArtistsComponent
  ],
  imports: [
    CommonModule,
    // AngularTiltModule,
    CoreModule,
    PublicRoutingModule,
  ],
  exports: [
  ]
})
export class PublicModule { }
