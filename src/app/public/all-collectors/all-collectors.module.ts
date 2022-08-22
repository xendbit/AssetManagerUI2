import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCollectorsComponent } from './all-collectors/all-collectors.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    AllCollectorsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AllCollectorsComponent}])
  ],
  exports: [AllCollectorsComponent]
})
export class AllCollectorsModule { }
