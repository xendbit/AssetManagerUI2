import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShoreComponent} from './shore/shore.component';

const routes: Routes = [
  {path: '', component: ShoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
