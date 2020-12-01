import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../shared/services/auth.service";
import {MatDialog} from '@angular/material/dialog';
import { PhoneloginComponent} from './phonelogin/phonelogin.component'
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-shipperlogin',
  templateUrl: './shipperlogin.component.html',
  styleUrls: ['./shipperlogin.component.css']
})
export class ShipperloginComponent implements OnInit {
  type=null;
  constructor( public dialog: MatDialog,public authService: AuthService,private route: ActivatedRoute,
    private router: Router, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(
        "search",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/search.svg")
      );
    }

  openDialog(): void {
    const dialogRef = this.dialog.open(PhoneloginComponent, {
      width:'39%',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnInit(): void {
    this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      if(params.login==1){
        this.type=1;
      }else if(params.login==2){
        this.type=2;
      }
      
    });}
    
    nextPage(){
      this.router.navigate(['signup'], { queryParams: { signup: this.type } });
    }

    prevPage(){
      this.router.navigate(['']);
    }
}
