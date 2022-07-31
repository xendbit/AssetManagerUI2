import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {CoreModule} from '../core/core.module';

import { CollectorsComponent } from './collectors/collectors.component';
import { PopularArtistsComponent } from './popular-artists/popular-artists.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShoreComponent } from './shore/shore.component';
import { ArtistsComponent } from './artists/artists.component';


@NgModule({
  declarations: [
    ShoreComponent,
    CollectorsComponent,
    PopularArtistsComponent,
    ArtistsComponent,
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
