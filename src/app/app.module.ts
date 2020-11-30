import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './routes/homepage/homepage.component';
import { LoginComponent } from './routes/login/login.component';
import { ShipperloginComponent } from './routes/shipper-login/shipperlogin/shipperlogin.component';
import { ShippersignupComponent } from './routes/shipper-login/shippersignup/shippersignup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PhoneloginComponent } from './routes/shipper-login/shipperlogin/phonelogin/phonelogin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    ShipperloginComponent,
    ShippersignupComponent,
    PhoneloginComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
