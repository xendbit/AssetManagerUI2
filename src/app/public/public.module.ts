import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {CoreModule} from '../core/core.module';

import { CollectorsComponent } from './collectors/collectors.component';
import { PopularArtistsComponent } from './popular-artists/popular-artists.component';
import { PublicRoutingModule } from './public-routing.module';
import { ShoreComponent } from './shore/shore.component';
import { CreatorsComponent } from './creators/creators.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AllCreatorsModule } from "./all-creators/all-creators.module";
import { AllGalleriesModule } from "./all-galleries/all-galleries.module";
import { AllCollectorsModule } from "./all-collectors/all-collectors.module";


@NgModule({
  declarations: [
    ShoreComponent,
    CollectorsComponent,
    PopularArtistsComponent,
    CreatorsComponent,
    GalleryComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    PublicRoutingModule,
    AllCreatorsModule,
    AllGalleriesModule,
    AllCollectorsModule
  ],
  exports: [
  ]
})
export class PublicModule { }
