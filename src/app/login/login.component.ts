import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  invalidLogin;
  ngOnInit() {
  }
  loading;
  login(form: NgForm) {
    this.loading = true;
    let credentials = JSON.stringify(form.value);
    this.http.post("https://switchmagic.com/api/auth/login", credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      let token = (<any>response).token;
      localStorage.setItem("jwt", token);
      let userNumber = (<any>response).userNumber;
      let userName = (<any>response).userName;
      localStorage.setItem("acc", userNumber);
      localStorage.setItem("userName", userName);
      this.invalidLogin = false;
      this.router.navigate(["/home"]);
    }, err => {
      this.invalidLogin = true;
      this.loading = undefined;
    });
  }
  newAcc() {
    this.router.navigate(["/newacc"]);
  }
}
