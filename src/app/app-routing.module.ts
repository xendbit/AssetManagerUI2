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
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAssetsComponent } from './admin-assets/admin-assets.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BuyAssetComponent } from './buy-asset/buy-asset.component';
import { AllAssetsComponent } from './all-assets/all-assets.component';
import { SellAssetComponent } from './sell-asset/sell-asset.component';
import { BuyOrdersComponent } from './buy-orders/buy-orders.component';
import { NotificationsComponent } from './notifications/notifications.component';


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
  { path: 'all-users',       
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
    component: AdminViewComponent
  },
  {
    path: 'home',
    component: UpgradeComponent
  },
  { path: 'admin-settings',     component: AdminSettingsComponent },
  {
    path: 'viewAsset',
    component: ViewAssetComponent
  },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'fund',   component: BuyAssetComponent },
  { path: 'assets',     component: AllAssetsComponent },
  { path: 'admin-view',     component: SellAssetComponent },
  { path: 'orders',           component: BuyOrdersComponent },
 
  { path: 'issuer', component: IssuerComponent },
  { path: 'myAssets',  component: NotificationsComponent }
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
