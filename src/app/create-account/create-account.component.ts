import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../config';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor(
    private _httpClient: HttpClient
    , private _router: Router
    , private _config: Config
  ) { }
  invalidLogin;
  apiEndPoint = this._config.urls.apiEndPoint;
  @ViewChild('password', { static: false }) password: ElementRef;
  @ViewChild('confirmPassword', { static: false }) confirmPassword: ElementRef;
  @ViewChild('userName', { static: false }) userName: ElementRef;
  @ViewChild('email', { static: false }) email: ElementRef;
  loginMessage;
  loading = false;
  ngOnInit() {
    this.loginMessage = document.getElementById('loginMessage');
  }
  createAccount(form: NgForm) {
    this.loginMessage.innerHTML = "";
    let credentials = JSON.stringify(form.value);
    if (this.password.nativeElement.value != '' && this.confirmPassword.nativeElement.value != '') {
      if (this.password.nativeElement.value == this.confirmPassword.nativeElement.value) {
        if (this.userName.nativeElement.value !== '' && this.email.nativeElement.value !== '') {
          this.loading = true;
          this._httpClient.post('https://switchmagic.com/api/values', credentials
            , {
              headers: new HttpHeaders({
                "Content-Type": "application/json"
              })
            }
          )
            .subscribe(
              (res) => {

                var status = res["status"];
                if (status != "success") {
                  this.loginMessage.innerHTML = status;
                }
                this.createDB(res["userNumber"], form);
                // this.disabled = true;
                // this._behaviorSubject.refreshImagesDB('refresh');
                //this._router.navigate(['/home']);
              },
              err => console.log(err)
            );
        }
        else {
          this.loginMessage.innerHTML = "Please complete before submitting";
          return;
        }
      }
      else {
        this.invalidLogin = true;
        this.loginMessage.innerHTML = "Passwords don't match.";
        return;
      }
    }
    else {
      this.loginMessage.innerHTML = "Please complete before submitting";
      return;
    }
  }
  createDB(id, form) {
    this._httpClient.get('https://switchmagic.com:4111/createdb?id=' + id)
      .subscribe(response => {
        localStorage.setItem("acc", id);
        this.login(form);
      });
  }
  login(form: NgForm) {
    let credentials = JSON.stringify(form.value);
    let loginVals = form.value;
    //credentials:  {"username":"jpjpiesco@gmail.com","password":"mebloggy123$"}
    let loginObject = { username: loginVals["email"], password: loginVals["password"] };
    this._httpClient.post("https://switchmagic.com/api/auth/login", loginObject, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      let token = (<any>response).token;
      localStorage.setItem("jwt", token);
      let userNumber = (<any>response).userNumber;
      localStorage.setItem("acc", userNumber);
      let userName = (<any>response).userName;
      localStorage.setItem("userName", userName);
      this.loading = false;
      //this.invalidLogin = false;
      this._router.navigate(["/home"]);
    }, err => {
      console.log(err);
      this.loading = false;
      alert("There was an error during login. Please go to the login screen and try to login with the account you just created. Thank you!");
      //this.invalidLogin = true;
    });
  }
  showhide = true;
  showhidepassword() {
    if (this.showhide) {
      this.password.nativeElement.type = "text";
      this.confirmPassword.nativeElement.type = "text";
    }
    else {
      this.password.nativeElement.type = "password";
      this.confirmPassword.nativeElement.type = "password";
    }
    this.showhide = !this.showhide;
  }
}

