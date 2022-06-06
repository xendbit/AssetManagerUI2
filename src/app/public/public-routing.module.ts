import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShoreComponent} from './shore/shore.component';

const routes: Routes = [
  {path: '', component: ShoreComponent},
  { path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
