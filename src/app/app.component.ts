import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './routes/login/login.component'
import {MatDialog ,MatDialogConfig} from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title : any;
  currentUser:any;
  isActive = true;
    constructor(public dialog: MatDialog, private router: Router) { }

    ngOnInit(): void {
      this.currentUser =localStorage.getItem('session');
      if(this.currentUser){
          this.title="LOGOUT"
        } else {
          this.title="LOGIN"
        }
      }

    openDialog() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.minWidth = "40%";
      // dialogConfig.data = {
      //   id: this.id,
      // };
      this.dialog.open(LoginComponent,dialogConfig);
      // dialogRef.afterClosed().subscribe(result => {
      //   this.id = null;
      //   this.viewAllLocation();
      // });
    }
    
    Logout(){
      console.log('hi');
      this.title='LOGOUT'
      firebase.initializeApp(environment.firebase)
      firebase.auth().signOut()
      this.router.navigate([''])
      localStorage.removeItem("session")
    }
  }
  