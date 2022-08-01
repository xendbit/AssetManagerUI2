import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllGalleriesComponent } from './all-galleries/all-galleries.component';



@NgModule({
  declarations: [
    AllGalleriesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [AllGalleriesComponent]
})
export class AllGalleriesModule { }
