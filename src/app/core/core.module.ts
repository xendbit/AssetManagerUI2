import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HeroComponent} from '../public/hero/hero.component';
import {PublicModule} from '../public/public.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { SliderComponent } from './components/slider/slider.component';
import { NFTCardComponent } from './components/nftcard/nftcard.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import {CarouselModule} from 'primeng/carousel';
import {DataViewModule} from 'primeng/dataview';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { BlogComponent } from './components/blog/blog.component';
import { AssetsGridComponent } from './components/assets-grid/assets-grid.component';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {GalleriaModule} from 'primeng/galleria';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {DialogModule} from 'primeng/dialog';
import { NgxStripeModule } from 'ngx-stripe';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ConnectWalletComponent } from './components/connect-wallet/connect-wallet.component';
import { PaymentComponent } from './components/payment/payment.component';
import {SidebarModule} from 'primeng/sidebar';
import { NgxUiLoaderModule } from "ngx-ui-loader";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    DataViewModule,
    MessageModule,
    MessagesModule,
    ToastModule,
    GalleriaModule,
    OverlayPanelModule,
    ScrollingModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule,
    NgxUiLoaderModule,
    SidebarModule,
    RadioButtonModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    SubscribeComponent,
    SliderComponent,
    NFTCardComponent,
    CarouselComponent,
    BlogComponent,
    AssetsGridComponent,
    ConnectWalletComponent,
    PaymentComponent,
    HeroComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    SubscribeComponent,
    SliderComponent,
    NFTCardComponent,
    CarouselComponent,
    BlogComponent,
    AssetsGridComponent,
    ConnectWalletComponent,
    PaymentComponent,
    HeroComponent
  ],
  providers: [MessageService],
})
export class CoreModule {
 }
