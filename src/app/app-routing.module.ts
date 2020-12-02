import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './routes/homepage/homepage.component'
import {ShipperloginComponent} from './routes/shipper-login/shipperlogin/shipperlogin.component'
import {ShippersignupComponent} from './routes/shipper-login/shippersignup/shippersignup.component'
import {ShippermapComponent} from './routes/shippermap/shippermap.component'

import {AuthenticationGuard} from './shared/guard/authentication.guard';
const routes: Routes = [
  {
    path:'',
    component: HomepageComponent,
    pathMatch: 'full',
  },
  {
    path:'login',
    component: ShipperloginComponent
  },
  {
    path:'signup',
    component: ShippersignupComponent
  },
  {
    path:'shippermap',
    component: ShippermapComponent,
    canActivate:[AuthenticationGuard]
  }
  // {
  //   path:'shipperlogin',
  //   component: ShipperloginComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
