import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading;
  constructor(
    private jwt: JwtService
    , private router: Router
  ) { }

  ngOnInit() {
  }
  login(form: NgForm) {
    this.loading = true;
    const credentials = JSON.stringify(form.value);
    const un = form.value.username;
    const pw = form.value.password;
    this.jwt.login(un, pw).subscribe(res => {
      console.log(res);
      this.router.navigate(['/home']);
      console.log('navigated');
    }, err => {
      this.loading = false;
      console.log('err: ', err.status);
    });
    // this.http.post("https://switchmagic.com/api/auth/login", credentials, {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json"
    //   })
    // }).subscribe(response => {
    //   let token = (<any>response).token;
    //   localStorage.setItem("jwt", token);
    //   let userNumber = (<any>response).userNumber;
    //   let userName = (<any>response).userName;
    //   localStorage.setItem("acc", userNumber);
    //   localStorage.setItem("userName", userName);
    //   this.invalidLogin = false;
    //   this.router.navigate(["/home"]);
    // }, err => {
    //   this.invalidLogin = true;
    //   this.loading = undefined;
    // });
  }

}
