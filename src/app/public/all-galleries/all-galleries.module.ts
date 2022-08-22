import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllGalleriesComponent } from './all-galleries/all-galleries.component';
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    AllGalleriesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AllGalleriesComponent}])
  ],
  exports: [AllGalleriesComponent]
})
export class AllGalleriesModule { }
