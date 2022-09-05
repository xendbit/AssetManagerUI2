import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';



@NgModule({
  declarations: [
    RefundPolicyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: RefundPolicyComponent}])
  ]
})
export class RefundPolicyModule { }
