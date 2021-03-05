import { AllUsersComponent } from './all-users/all-users.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AboutComponent } from './about/about.component';
import { ViewAssetComponent } from './view-asset/view-asset.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { IssuerDashboardComponent } from './issuer-dashboard/issuer-dashboard.component';
import { IssuerComponent } from './issuer/issuer.component';
import { IssueAssetsComponent } from './issue-assets/issue-assets.component';
import { ApproveAssetsComponent } from './approve-assets/approve-assets.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAssetsComponent } from './admin-assets/admin-assets.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { SecondaryViewComponent } from './secondary-view/secondary-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AllAssetsComponent } from './all-assets/all-assets.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PortfolioComponent } from './my-portfolio/portfolio.component';


const routes: Routes =[
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }, 
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'add-admin',  component: AdminComponent },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  { 
    path: 'admin-assets',
    component: AdminAssetsComponent
  },
  {
    path: 'approve',
    component: ApproveAssetsComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'add-issuer',
    component: IssuerComponent
  },
  { path: 'view-users',       
  component: AllUsersComponent 
  },
  {
    path: 'issuer-dashboard',
    component: IssuerDashboardComponent
  },
  { path: 'issue',       
    component: IssueAssetsComponent 
  },
  {
    path: 'request-password',
    component: RequestPasswordComponent
  },
  {
    path: 'asset-order',
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
  { path: 'fund',   component: UserDashboardComponent },
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
