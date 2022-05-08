import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {AngularTiltModule} from 'angular-tilt';

import { HeroComponent } from './hero/hero.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShoreComponent } from './shore/shore.component';
import { CuratorsOfTheWeekComponent } from './curators-of-the-week/curators-of-the-week.component';


@NgModule({
  declarations: [
    ShoreComponent,
    HeroComponent,
    CuratorsOfTheWeekComponent
  ],
  imports: [
    CommonModule,
    AngularTiltModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
