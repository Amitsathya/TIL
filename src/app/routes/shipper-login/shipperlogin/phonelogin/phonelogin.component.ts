import { Component, OnInit } from '@angular/core';
import {WindowService } from '../../../../shared/services/window.service'
import * as firebase from 'firebase';
import {MatDialogRef} from '@angular/material/dialog';
import {ShipperloginComponent} from '../shipperlogin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-phonelogin',
  templateUrl: './phonelogin.component.html',
  styleUrls: ['./phonelogin.component.css']
})
export class PhoneloginComponent implements OnInit {
  type= null;
  windowRef: any;
  phoneNumber = new PhoneNumber()
  verificationCode: string;
  user: any;

  constructor(private win: WindowService,private router: Router, private route: ActivatedRoute,private toastr: ToastrService,
    public dialogRef: MatDialogRef<ShipperloginComponent>,
    ) {}

    ngOnInit(): void {
      this.windowRef = this.win.windowRef
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
      this.windowRef.recaptchaVerifier.render()
      this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        if(params.login==1){
          this.type=1;
        }else if(params.login==2){
          this.type=2;
        }
      });
    }

    sendLoginCode() {
        const appVerifier = this.windowRef.recaptchaVerifier;
        const num = this.phoneNumber.e164;
        firebase.auth().signInWithPhoneNumber(num, appVerifier)
                .then(result => {
                    this.windowRef.confirmationResult = result;
                })
                .catch( error => console.log(error) );
      }

      verifyLoginCode() {
        this.windowRef.confirmationResult
                      .confirm(this.verificationCode)
                      .then( result => {
                        console.log(result);
                        if (result.user.email==null){
                          var user = firebase.auth().currentUser;
                          user.delete();
                          console.log(this.type);
                          this.toastr.error('User is not Registered! Please Register');
                          this.router.navigate(['signup'], { queryParams: { signup: this.type } });
                        }
                        this.user = null;
        })
        .catch( error => console.log(error, "Incorrect code entered?"));
      }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
