import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ConnectWalletComponent } from './components/connect-wallet/connect-wallet.component';
import { PaymentComponent } from './components/payment/payment.component';

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
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule,
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
    PaymentComponent
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
    PaymentComponent
  ],
  providers: [MessageService],
})
export class CoreModule {
 }
