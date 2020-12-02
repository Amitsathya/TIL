import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { PhonesignupComponent} from './phonesignup/phonesignup.component'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase} from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shippersignup',
  templateUrl: './shippersignup.component.html',
  styleUrls: ['./shippersignup.component.css']
})
export class ShippersignupComponent implements OnInit {
  register: FormGroup;
  type=null;
  constructor(private route: ActivatedRoute,private router: Router, public dialog: MatDialog,private fb: FormBuilder,private toastr: ToastrService,private db: AngularFireDatabase) {
    this.register= this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phonNumber: ['', Validators.required],
    rating: [''],
    uid: ['']
  }) }

  openDialog(): void {
    const dialogRef = this.dialog.open(PhonesignupComponent, {
      width: '39%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.register.controls['phonNumber'].setValue(result.user.phoneNumber);
      this.register.controls['firstName'].setValue(result.additionalUserInfo.profile.given_name);
      this.register.controls['lastName'].setValue(result.additionalUserInfo.profile.family_name);
      this.register.controls['uid'].setValue(result.user.uid)
      }
    });
  }
  
  saveForm(){
    if (this.register.valid){
      let tutorialsRef;
      if(this.type==1){
        tutorialsRef = this.db.object('ShipperInfo/'+this.register.value.uid);
      }else{
        tutorialsRef = this.db.object('CarrierInfo/'+this.register.value.uid);
      }
      tutorialsRef.set({firstName: this.register.value.firstName,
        lastName: this.register.value.lastName,
        phonNumber: this.register.value.phonNumber,
        rating: '0.0',})
        this.toastr.success('User Registered Successfully!');
    }else {
      this.toastr.error('Please Fill The Form!');
    }
  }

  ngOnInit(): void {
    this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      if(params.signup==1){
        this.type=1;
      }else if(params.signup==2){
        this.type=2;
      }
    });
  }

  prevPage(){
    this.router.navigate(['login'], { queryParams: { login: this.type } });
  }

}
