import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router
    , private jwt: JwtHelperService
    ) {
  }
  canActivate() {
    if (this.jwt.isTokenExpired(localStorage.getItem('jwt'))) {
      this.router.navigate(['login']);
    }
    return this.jwt.isTokenExpired(localStorage.getItem('jwt')) ? false : true;
  }
}
