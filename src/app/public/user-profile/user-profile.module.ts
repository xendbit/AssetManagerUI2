import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {CoreModule} from "../../core/core.module";
import {RouterModule} from "@angular/router";
import {SharedModule} from "primeng/api";



@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: UserProfileComponent}]),
    CoreModule,
    SharedModule
  ]
})
export class UserProfileModule { }
