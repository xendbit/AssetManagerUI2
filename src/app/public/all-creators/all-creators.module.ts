import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCreatorsComponent } from './all-creators/all-creators.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    AllCreatorsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AllCreatorsComponent}])
  ],
  exports: [AllCreatorsComponent]
})
export class AllCreatorsModule { }
