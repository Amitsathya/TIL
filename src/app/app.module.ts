import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AgmCoreModule } from '@agm/core';
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
import { PhonesignupComponent } from './routes/shipper-login/shippersignup/phonesignup/phonesignup.component';
import { ToastrModule } from 'ngx-toastr';
import { ShippermapComponent } from './routes/shippermap/shippermap.component';

import { MatIconModule } from "@angular/material/icon";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    ShipperloginComponent,
    ShippersignupComponent,
    PhoneloginComponent,
    PhonesignupComponent,
    ShippermapComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatIconModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmKYQGubovyobyRFfjEQQbMmRAY8SrgFk',
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
