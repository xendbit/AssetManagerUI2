import { AdminSettingsComponent } from './pages/admin-settings/admin-settings.component';
import { AboutComponent } from './pages/about/about.component';
import { PortfolioComponent } from './pages/my-portfolio/portfolio.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { AllAssetsComponent } from './pages/all-assets/all-assets.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ViewAssetComponent } from './pages/view-asset/view-asset.component';
import { SecondaryViewComponent } from './pages/secondary-view/secondary-view.component';
import { IssueAssetsComponent } from './pages/issue-assets/issue-assets.component';
import { IssuerDashboardComponent } from './pages/issuer-dashboard/issuer-dashboard.component';
import { IssuerComponent } from './pages/issuer/issuer.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';

import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminViewComponent } from './pages/admin-view/admin-view.component';
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'add-admin',  component: AdminComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'add-issuer',
    component: IssuerComponent
  },
  {
    path: 'issuer-dashboard',
    component: IssuerDashboardComponent
  },
  { path: 'issue',       
    component: IssueAssetsComponent 
  },
  {
    path: 'view-sec',
    component: SecondaryViewComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'viewAsset',
    component: ViewAssetComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  // { path: 'dashboard',      component: DashboardComponent },
  { path: 'user-dashboard',   component: UserDashboardComponent },
  { path: 'assets',     component: AllAssetsComponent },
  { path: 'admin-view',     component: AdminViewComponent },
  { path: 'orders',           component: MyOrdersComponent },
  { path: 'admin-settings',     component: AdminSettingsComponent },
  { path: 'issuer', component: IssuerComponent },
  { path: 'myAssets',  component: PortfolioComponent },
  { path: 'featured', component: FeaturedCategoriesComponent}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
