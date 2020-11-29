import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './routes/homepage/homepage.component'
import {ShipperloginComponent} from './routes/shipper-login/shipperlogin/shipperlogin.component'
import {ShippersignupComponent} from './routes/shipper-login/shippersignup/shippersignup.component'


const routes: Routes = [
  {
    path:'',
    component: HomepageComponent
  },
  {
    path:'shipperlogin',
    component: ShipperloginComponent
  },
  {
    path:'shippersignup',
    component: ShippersignupComponent
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
