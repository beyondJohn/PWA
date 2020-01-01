import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(
    private httpClient: HttpClient
  ) { }

  login(username: string, password: string) {
    return this.httpClient.post<{ token: string, userNumber: string, userName: string }>('https://switchmagic.com/api/auth/login'
      , { username, password })
      .pipe(tap(res => {
        localStorage.setItem('jwt', res.token);
        localStorage.setItem('acc', res.userNumber);
        localStorage.setItem('userName', res.userName);
      })
      );
  }
}
