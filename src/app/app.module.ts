import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { MainService } from './core/services/main.service';
import {CarouselModule} from 'primeng/carousel';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectWalletComponent } from './pages/connect-wallet/connect-wallet.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { AboutComponent } from './pages/about/about.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CreateAssetsComponent } from './components/create-assets/create-assets.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectWalletComponent,
    AuthenticationComponent,
    AboutComponent,
    AssetsComponent,
    ContactComponent,
    CreateAssetsComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    CarouselModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent],
  exports: [CreateAssetsComponent]
})
export class AppModule { }
