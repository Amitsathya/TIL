import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { PhoneloginComponent} from './phonelogin/phonelogin.component'
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import  { auth }  from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shipperlogin',
  templateUrl: './shipperlogin.component.html',
  styleUrls: ['./shipperlogin.component.css']
})
export class ShipperloginComponent implements OnInit {
  type=null;
  user='1';
  constructor( public dialog: MatDialog,private route: ActivatedRoute,
    private router: Router, private matIconRegistry: MatIconRegistry,public afAuth: AngularFireAuth, private toastr: ToastrService,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(
        "search",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/search.svg")
      );
    }

  openDialog(): void {
    const dialogRef = this.dialog.open(PhoneloginComponent, {
      width:'39%',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
        if (result.user.phoneNumber==null){
          var user = this.afAuth.auth.currentUser;
          user.delete();
          this.toastr.error('User is not Registered! Please Register');
        } else {
          localStorage.setItem("session", 'true');
          this.successPage();
        }
    }).catch((error) => {
        console.log(error)
    })
  }

  ngOnInit(): void {
    this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      if(params.login==1){
        this.type=1;
      }else if(params.login==2){
        this.type=2;
      }
      
    });}
    
    nextPage(){
      this.router.navigate(['signup'], { queryParams: { signup: this.type } });
    }

    prevPage(){
      this.router.navigate(['']);
    }
    
    successPage(){
      this.router.navigate(['shippermap']);
    }
}
