import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCollectorsComponent } from './all-collectors/all-collectors.component';



@NgModule({
  declarations: [
    AllCollectorsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [AllCollectorsComponent]
})
export class AllCollectorsModule { }
