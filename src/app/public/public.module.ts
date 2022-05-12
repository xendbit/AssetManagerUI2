import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {AngularTiltModule} from 'angular-tilt';
import {CoreModule} from '../core/core.module';

import { CuratorsOfTheWeekComponent } from './curators-of-the-week/curators-of-the-week.component';
import { HeroComponent } from './hero/hero.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShoreComponent } from './shore/shore.component';


@NgModule({
  declarations: [
    ShoreComponent,
    // HeroComponent,
    CuratorsOfTheWeekComponent
  ],
  imports: [
    CommonModule,
    AngularTiltModule,
    CoreModule,
    PublicRoutingModule,
  ],
  exports: [
    // HeroComponent
  ]
})
export class PublicModule { }
