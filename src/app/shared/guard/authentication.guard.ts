import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  currentUser:any
  type:any
  constructor(private toastr: ToastrService,private router:Router){}
  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
    this.currentUser =localStorage.getItem('session');
    this.type= localStorage.getItem('type')
      if(this.currentUser && this.type=="s"){
        return true;
      }
      this.toastr.error('Please Log into Shipper Account');
      return false;
    }
  // }
  
}
