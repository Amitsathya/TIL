import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../shared/services/auth.service";
import {MatDialog} from '@angular/material/dialog';
import { PhoneloginComponent} from './phonelogin/phonelogin.component'

@Component({
  selector: 'app-shipperlogin',
  templateUrl: './shipperlogin.component.html',
  styleUrls: ['./shipperlogin.component.css']
})
export class ShipperloginComponent implements OnInit {
  
  constructor( public dialog: MatDialog,public authService: AuthService) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(PhoneloginComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnInit(): void {}
}
