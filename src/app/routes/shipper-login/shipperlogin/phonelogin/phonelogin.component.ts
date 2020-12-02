import { Component, OnInit } from '@angular/core';
import {WindowService } from '../../../../shared/services/window.service'
import * as firebase from 'firebase';
import {MatDialogRef} from '@angular/material/dialog';
import {ShipperloginComponent} from '../shipperlogin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-phonelogin',
  templateUrl: './phonelogin.component.html',
  styleUrls: ['./phonelogin.component.css']
})
export class PhoneloginComponent implements OnInit {
  type= null;
  windowRef: any;
  phonenumber: FormGroup;
  verificationCode: string;
  user: any;

  constructor(private win: WindowService,private router: Router,private fb: FormBuilder,private route: ActivatedRoute,private toastr: ToastrService,
    public dialogRef: MatDialogRef<ShipperloginComponent>,
    ) {
      this.phonenumber= this.fb.group({
        country: ['',Validators.required],
        line: ['', [Validators.required,Validators.maxLength(10)]],
        code: ['',Validators.required]
      })
    }

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
        const num = `+${this.phonenumber.value.country}${this.phonenumber.value.line}`;
        firebase.auth().signInWithPhoneNumber(num, appVerifier)
                .then(result => {
                  console.log(result);
                  
                    this.windowRef.confirmationResult = result;
                })
                .catch( error => console.log(error) );
      }

      verifyLoginCode() {
        this.windowRef.confirmationResult
                      .confirm(this.phonenumber.value.code)
                      .then( result => {
                        console.log(result);
                        if (result.user.email==null){
                          var user = firebase.auth().currentUser;
                          user.delete();
                          console.log(this.type);
                          this.toastr.error('User is not Registered! Please Register');
                          this.router.navigate(['signup'], { queryParams: { signup: this.type } });
                        } else {
                          this.toastr.success('Successfully Logged In!')
                          this.dialogRef.close()
                          localStorage.setItem("session", 'true');
                          this.router.navigate(['shippermap']);
                        }
                        this.user = null;
        })
        .catch( error => this.toastr.error("Incorrect code entered"));
      }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
