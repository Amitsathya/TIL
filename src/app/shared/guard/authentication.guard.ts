import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  currentUser:any
  constructor(private toastr: ToastrService,private router:Router){}
  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
    console.log(this.router.url);
    this.currentUser =localStorage.getItem('session');
    if(this.currentUser){
        return true;
      }
      this.router.navigate(['']);
      this.toastr.error('Please Login');
      return false;
  }
  
}
