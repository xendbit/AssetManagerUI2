import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShoreComponent} from './shore/shore.component';

const routes: Routes = [
  {path: '', component: ShoreComponent},
  { path: 'privacy', loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'terms-and-conditions', loadChildren: () => import('./terms-and-conditions/terms-and-conditions-routing.module').then(m => m.TermsAndConditionsRoutingModule)},
  { path: 'all-creators', loadChildren: () => import('./all-creators/all-creators.module').then(m => m.AllCreatorsModule)},
  { path: 'all-galleries', loadChildren: () => import('./all-galleries/all-galleries.module').then(m => m.AllGalleriesModule)},
  { path: 'all-collectors', loadChildren: () => import('./all-collectors/all-collectors.module').then(m => m.AllCollectorsModule)},
  { path: 'user-profile/:walletAddress', loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
