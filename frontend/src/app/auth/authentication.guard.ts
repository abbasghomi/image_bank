import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var token = localStorage.getItem('token');
      if(token != null){
        console.log(`token: ${token}`);
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        console.log(`expiery: ${expiry}`);
        if((Math.floor((new Date).getTime() / 1000)) >= expiry){
          this.router.navigate(['/user/logout']);
          return false;
        }
        return true;
      } else{
        this.router.navigate(['/user/logout']);
        return false;
      }
  }

}
