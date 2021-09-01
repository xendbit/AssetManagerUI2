import { AdminSettingsComponent } from './pages/admin-settings/admin-settings.component';
import { AboutComponent } from './pages/about/about.component';
import { ViewAssetComponent } from './pages/view-asset/view-asset.component';
import { IssuerComponent } from './pages/issuer/issuer.component';
import { IssueAssetsComponent } from './pages/issue-assets/issue-assets.component';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SecondaryViewComponent } from './pages/secondary-view/secondary-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AllAssetsComponent } from './pages/all-assets/all-assets.component';
import { AdminViewComponent } from './pages/admin-view/admin-view.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { PortfolioComponent } from './pages/my-portfolio/portfolio.component';


const routes: Routes =[
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }, 
  { path: 'add-admin',  component: AdminComponent },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'add-issuer',
    component: IssuerComponent
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
  { path: 'admin-settings',     component: AdminSettingsComponent },
  {
    path: 'viewAsset',
    component: ViewAssetComponent
  },
  // { path: 'dashboard',      component: DashboardComponent },
  { path: 'user-dashboard',   component: UserDashboardComponent },
  { path: 'assets',     component: AllAssetsComponent },
  { path: 'admin-view',     component: AdminViewComponent },
  { path: 'orders',           component: MyOrdersComponent },
 
  { path: 'issuer', component: IssuerComponent },
  { path: 'myAssets',  component: PortfolioComponent }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forRoot(routes)
  ],
  exports: []
})
export class AppRoutingModule { }
