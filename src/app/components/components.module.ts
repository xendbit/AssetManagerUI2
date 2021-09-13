import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { IssuerSidebarComponent } from './issuer-sidebar/issuer-sidebar.component';

import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSidenavModule,
    CarouselModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AdminSidebarComponent,
    IssuerSidebarComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AdminSidebarComponent,
    IssuerSidebarComponent,
  ]
})
export class ComponentsModule { }
