import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { SecondaryViewComponent } from './pages/secondary-view/secondary-view.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { PortfolioComponent } from './pages/my-portfolio/portfolio.component';
import { AllAssetsComponent } from './pages/all-assets/all-assets.component';
import { AdminViewComponent } from './pages/admin-view/admin-view.component';
import { ViewAssetComponent } from './pages/view-asset/view-asset.component';
import { HomeComponent } from './pages/home/home.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
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
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories.component';
import {MatRadioModule} from '@angular/material/radio';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';


import {
  AgmCoreModule
} from '@agm/core';
import { AdminComponent } from './pages/admin/admin.component';
import { IssuerComponent } from './pages/issuer/issuer.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { IssueAssetsComponent } from './pages/issue-assets/issue-assets.component';
import { IssuerDashboardComponent } from './pages/issuer-dashboard/issuer-dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { AdminSettingsComponent } from './pages/admin-settings/admin-settings.component';



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
    CarouselModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminComponent,
    AdminDashboardComponent,
    IssuerComponent,
    IssueAssetsComponent,
    IssuerDashboardComponent,
    HomeComponent,
    ViewAssetComponent,
    AllAssetsComponent,
    PortfolioComponent,
    MyOrdersComponent,
    AdminViewComponent,
    DashboardComponent,
    AboutComponent,
    SecondaryViewComponent,
    UserDashboardComponent,
    AdminSettingsComponent,
    FeaturedCategoriesComponent
  ],
  providers: [
     {provide: LocationStrategy, useClass: HashLocationStrategy},
     {provide: 'googleTagManagerId', useValue: 'GTM-T774GH6'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
