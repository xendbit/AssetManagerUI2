import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SecondaryViewComponent } from './secondary-view/secondary-view.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PortfolioComponent } from './my-portfolio/portfolio.component';
import { AllAssetsComponent } from './all-assets/all-assets.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { ViewAssetComponent } from './view-asset/view-asset.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgImageSliderModule } from 'ng-image-slider';


import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import {MatButtonModule} from '@angular/material/button';
import { MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxSpinnerModule } from "ngx-spinner"; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';


import {
  AgmCoreModule
} from '@agm/core';
import { AdminComponent } from './admin/admin.component';
import { IssuerComponent } from './issuer/issuer.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAssetsComponent } from './admin-assets/admin-assets.component';
import { ApproveAssetsComponent } from './approve-assets/approve-assets.component';
import { IssueAssetsComponent } from './issue-assets/issue-assets.component';
import { IssuerDashboardComponent } from './issuer-dashboard/issuer-dashboard.component';
import { AboutComponent } from './about/about.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AllUsersComponent } from './all-users/all-users.component';



@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatTabsModule,
    NgxSpinnerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgImageSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminComponent,
    AdminDashboardComponent,
    AdminAssetsComponent,
    ApproveAssetsComponent,
    IssuerComponent,
    RequestPasswordComponent,
    ChangePasswordComponent,
    IssueAssetsComponent,
    IssuerDashboardComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ViewAssetComponent,
    AllAssetsComponent,
    PortfolioComponent,
    
    MyOrdersComponent,
    AdminViewComponent,
    DashboardComponent,
    AboutComponent,
    AdminSettingsComponent,
    AllUsersComponent,
    SecondaryViewComponent,
    UserDashboardComponent,

  ],
  providers: [
     {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
