import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './routes/login/login.component'
import {MatDialog ,MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'til';

    constructor(public dialog: MatDialog) { }
  
    ngOnInit(): void {
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
  
  }
  