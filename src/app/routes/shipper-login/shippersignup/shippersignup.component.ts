import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../shared/services/auth.service";
import {MatDialog} from '@angular/material/dialog';
import { PhonesignupComponent} from './phonesignup/phonesignup.component'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-shippersignup',
  templateUrl: './shippersignup.component.html',
  styleUrls: ['./shippersignup.component.css']
})
export class ShippersignupComponent implements OnInit {
  register: FormGroup;
  
  constructor( public dialog: MatDialog,private fb: FormBuilder,private toastr: ToastrService,private db: AngularFireDatabase,public authService: AuthService) {
    this.register= this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phonNumber: ['', Validators.required],
    rating: [''],
    uid: ['']
  }) }

  openDialog(): void {
    const dialogRef = this.dialog.open(PhonesignupComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.register.controls['phonNumber'].setValue(result.user.phoneNumber);
      this.register.controls['firstName'].setValue(result.additionalUserInfo.profile.given_name);
      this.register.controls['lastName'].setValue(result.additionalUserInfo.profile.family_name);
      this.register.controls['uid'].setValue(result.user.uid)
    });
  }
  
  saveForm(){
    if (this.register.valid){
      const tutorialsRef = this.db.list('ShipperInfo/'+this.register.value.uid);
      tutorialsRef.push({firstName: this.register.value.firstName,
        lastName: this.register.value.lastName,
        phonNumber: this.register.value.phonNumber,
        rating: '0.0',})
    }else {
      this.toastr.error('Please Fill The Form!');
    }
  }

  ngOnInit(): void {}

}
