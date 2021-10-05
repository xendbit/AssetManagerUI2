import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppController } from './app.controller';
import { HomeComponent } from './core/components/home/home.component';
import { ConnectWalletComponent } from './pages/connect-wallet/connect-wallet.component';
import { routerConfig } from './core/config/router-config.const';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: AppController.trans().home
    }
  },
  {
    path: 'connect-wallet',
    component: ConnectWalletComponent
  },
  {
    path: 'authentication',
    component: AuthenticationComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: routerConfig.users.base,
    loadChildren: () => import('./lazy/users/users.module').then(mod => mod.UsersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
