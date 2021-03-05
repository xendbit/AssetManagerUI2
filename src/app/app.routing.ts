import { AllUsersComponent } from './all-users/all-users.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AboutComponent } from './about/about.component';
import { PortfolioComponent } from './my-portfolio/portfolio.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AllAssetsComponent } from './all-assets/all-assets.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewAssetComponent } from './view-asset/view-asset.component';
import { SecondaryViewComponent } from './secondary-view/secondary-view.component';
import { IssueAssetsComponent } from './issue-assets/issue-assets.component';
import { IssuerDashboardComponent } from './issuer-dashboard/issuer-dashboard.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { IssuerComponent } from './issuer/issuer.component';
import { ApproveAssetsComponent } from './approve-assets/approve-assets.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAssetsComponent } from './admin-assets/admin-assets.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';



import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { AdminViewComponent } from './admin-view/admin-view.component';

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
  {
    path: 'issuer-dashboard',
    component: IssuerDashboardComponent
  },
  { path: 'issue',       
    component: IssueAssetsComponent 
  },
  { path: 'view-users',       
  component: AllUsersComponent 
  },
  {
    path: 'request-password',
    component: RequestPasswordComponent
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
  { path: 'myAssets',  component: PortfolioComponent }
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
