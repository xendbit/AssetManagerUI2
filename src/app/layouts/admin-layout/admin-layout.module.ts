import { BuyOrdersComponent } from '../../my-orders/my-orders.component';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { BuyAssetComponent } from '../../user-dashboard/user-dashboard.component';
import { AllAssetsComponent } from '../../all-assets/all-assets.component';
import { SellAssetComponent } from '../../admin-view/admin-view.component';
import { NotificationsComponent } from '../../my-portfolio/portfolio.component';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatTabsModule
  ],
  declarations: [
    // DashboardComponent,
    // BuyAssetComponent,
    // AllAssetsComponent,
    // SellAssetComponent,
    // BuyOrdersComponent,
    // NotificationsComponent
  ]
})

export class AdminLayoutModule {}
