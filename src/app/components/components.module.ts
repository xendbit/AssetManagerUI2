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
import { FeaturedCategoriesComponent } from './featured-categories/featured-categories.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSidenavModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AdminSidebarComponent,
    IssuerSidebarComponent,
    FeaturedCategoriesComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AdminSidebarComponent,
    IssuerSidebarComponent,
    FeaturedCategoriesComponent
  ]
})
export class ComponentsModule { }
