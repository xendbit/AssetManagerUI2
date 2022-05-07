import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {AngularTiltModule} from 'angular-tilt';

import { HeroComponent } from './hero/hero.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShoreComponent } from './shore/shore.component';


@NgModule({
  declarations: [
    ShoreComponent,
    HeroComponent
  ],
  imports: [
    CommonModule,
    AngularTiltModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
