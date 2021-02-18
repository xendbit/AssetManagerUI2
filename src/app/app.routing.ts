import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AboutComponent } from './about/about.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { BuyOrdersComponent } from './buy-orders/buy-orders.component';
import { AllAssetsComponent } from './all-assets/all-assets.component';
import { BuyAssetComponent } from './buy-asset/buy-asset.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewAssetComponent } from './view-asset/view-asset.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
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
import { UpgradeComponent } from './upgrade/upgrade.component';



import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { SellAssetComponent } from './sell-asset/sell-asset.component';

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
  {
    path: 'request-password',
    component: RequestPasswordComponent
  },
  {
    path: 'asset-order',
    component: AdminViewComponent
  },
  {
    path: 'home',
    component: UpgradeComponent
  },
  {
    path: 'viewAsset',
    component: ViewAssetComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'fund',   component: BuyAssetComponent },
  { path: 'assets',     component: AllAssetsComponent },
  { path: 'admin-view',     component: SellAssetComponent },
  { path: 'orders',           component: BuyOrdersComponent },
  { path: 'admin-settings',     component: AdminSettingsComponent },
  { path: 'issuer', component: IssuerComponent },
  { path: 'myAssets',  component: NotificationsComponent }
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
