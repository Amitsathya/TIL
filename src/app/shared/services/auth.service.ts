import { Injectable } from '@angular/core';
import  { auth }  from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth, private toastr: ToastrService// Inject Firebase auth service
  ) { }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
        console.log(result)
        if (result.user.phoneNumber==null){
          var user = this.afAuth.auth.currentUser;
          user.delete();
          this.toastr.error('User is not Registered! Please Register');
        }
    }).catch((error) => {
        console.log(error)
    })
  }
}
