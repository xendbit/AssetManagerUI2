import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCreatorsComponent } from './all-creators/all-creators.component';



@NgModule({
  declarations: [
    AllCreatorsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [AllCreatorsComponent]
})
export class AllCreatorsModule { }
