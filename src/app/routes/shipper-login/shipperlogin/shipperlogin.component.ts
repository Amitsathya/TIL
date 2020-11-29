import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../shared/services/auth.service";


@Component({
  selector: 'app-shipperlogin',
  templateUrl: './shipperlogin.component.html',
  styleUrls: ['./shipperlogin.component.css']
})
export class ShipperloginComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
