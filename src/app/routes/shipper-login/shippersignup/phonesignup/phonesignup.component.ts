import { Component, OnInit, Inject } from '@angular/core';
import {WindowService } from '../../../../shared/services/window.service'
import * as firebase from 'firebase';
import {MatDialogRef} from '@angular/material/dialog';
import {ShippersignupComponent} from '../shippersignup.component';
import  { auth }  from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-phonesignup',
  templateUrl: './phonesignup.component.html',
  styleUrls: ['./phonesignup.component.css']
})
export class PhonesignupComponent implements OnInit {
  windowRef: any;
  phonenumber : FormGroup;
  verificationCode: string;
  user: any;
  constructor(private win: WindowService, private fb: FormBuilder, private toastr: ToastrService,public afAuth: AngularFireAuth,
    public dialogRef: MatDialogRef<ShippersignupComponent>,
    ) {
      this.phonenumber= this.fb.group({
        country: ['', Validators.required],
        line: ['', Validators.required],
        code: ['',Validators.required]
      })
    }

    

    ngOnInit(): void {
      this.windowRef = this.win.windowRef
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
      this.windowRef.recaptchaVerifier.render()
    }

    sendLoginCode() {
        const appVerifier = this.windowRef.recaptchaVerifier;
        const num = `+${this.phonenumber.value.country}${this.phonenumber.value.line}`;
        this.afAuth.auth.signInWithPhoneNumber(num, appVerifier)
                .then(result => {
                  this.windowRef.confirmationResult = result;
                })
                .catch( error => console.log(error) );
      }

      verifyLoginCode() {
        this.windowRef.confirmationResult
                      .confirm(this.phonenumber.value.code)
                      .then( result => {
                        return this.AuthLogin(new auth.GoogleAuthProvider());
        })
        .catch( error =>  this.toastr.error("Incorrect code entered"));
      }
      
      GoogleAuth() {
        return this.AuthLogin(new auth.GoogleAuthProvider());
      }
      
      // Auth logic to run auth providers
      AuthLogin(provider) {
        return this.afAuth.auth.currentUser.linkWithPopup(provider)
        .then((result) => {
          this.dialogRef.close(result);          
        }).catch((error) => {
            console.log(error)
            if(error.code=='auth/provider-already-linked'){
              this.toastr.error('This Number is already linked with another Account, Please use another number');
              this.dialogRef.close();
            }
        })
      }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
