import { Component, OnInit, Inject } from '@angular/core';
import {WindowService } from '../../../../shared/services/window.service'
import * as firebase from 'firebase';
import {MatDialogRef} from '@angular/material/dialog';
import {ShippersignupComponent} from '../shippersignup.component';
import  { auth }  from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";


export class PhoneNumber {
  country: string;
  line: string;
  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.line
    return `+${num}`
  }

}

@Component({
  selector: 'app-phonesignup',
  templateUrl: './phonesignup.component.html',
  styleUrls: ['./phonesignup.component.css']
})
export class PhonesignupComponent implements OnInit {
  windowRef: any;
  phoneNumber = new PhoneNumber()
  verificationCode: string;
  user: any;
  constructor(private win: WindowService, public afAuth: AngularFireAuth,
    public dialogRef: MatDialogRef<ShippersignupComponent>
    ) {}

    

    ngOnInit(): void {
      this.windowRef = this.win.windowRef
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
      this.windowRef.recaptchaVerifier.render()
    }

    sendLoginCode() {
        const appVerifier = this.windowRef.recaptchaVerifier;
        const num = this.phoneNumber.e164;
        this.afAuth.auth.signInWithPhoneNumber(num, appVerifier)
                .then(result => {
                  this.windowRef.confirmationResult = result;
                })
                .catch( error => console.log(error) );
      }

      verifyLoginCode() {
        this.windowRef.confirmationResult
                      .confirm(this.verificationCode)
                      .then( result => {
                        return this.AuthLogin(new auth.GoogleAuthProvider());
        })
        .catch( error => console.log(error, "Incorrect code entered?"));
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
        })
      }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
