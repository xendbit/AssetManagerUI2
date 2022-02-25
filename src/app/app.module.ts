import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {PlatformModule} from '@angular/cdk/platform';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { MainService } from './core/services/main.service';
import { CarouselModule} from 'primeng/carousel';
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectWalletComponent } from './pages/connect-wallet/connect-wallet.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { AboutComponent } from './pages/about/about.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CreateAssetsComponent } from './components/create-assets/create-assets.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { CreatorsComponent } from './pages/creators/creators.component';
import { ngfModule } from "angular-file";
import { MessagesModule} from 'primeng/messages';
import { MessageModule} from 'primeng/message';
import { ToastModule} from 'primeng/toast';
import { GalleriaModule} from 'primeng/galleria';
import { AssetDetailsComponent } from './pages/asset-details/asset-details.component';
import { MyAssetsComponent } from './pages/my-assets/my-assets.component';
import { CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {ChartModule} from 'primeng/chart';
import { MintComponent } from './pages/mint/mint.component';
import { FAQComponent } from './pages/faq/faq.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NgxEchartsModule } from 'ngx-echarts';
import {PanelModule} from 'primeng/panel';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {FileUploadModule} from 'primeng/fileupload';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentModule } from './niftyrow-pay';


@NgModule({
  declarations: [
    AppComponent,
    ConnectWalletComponent,
    AuthenticationComponent,
    AboutComponent,
    AssetsComponent,
    ContactComponent,
    CreateAssetsComponent,
    UserDashboardComponent,
    CreatorsComponent,
    AssetDetailsComponent,
    MyAssetsComponent,
    MintComponent,
    FAQComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    PlatformModule,
    AppRoutingModule,
    CoreModule,
    PaymentModule,
    HttpClientModule,
    CarouselModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ngfModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    GalleriaModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ProgressSpinnerModule,
    FileUploadModule,
    OverlayPanelModule,
    ChartModule,
    PanelModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgxStripeModule.forRoot('pk_test_51KP6OgCU7wHmOgIeQ84Kyn1S1CjHuIreTqOZOaoYNcMwndLCx0ghjNBsI7ywyy4hFVZk6QEbTG4kQhY2AklEiGLb00bgQlYxn8'),
  ],
  providers: [MainService],
  bootstrap: [AppComponent],
  exports: [CreateAssetsComponent]
})
export class AppModule { }
