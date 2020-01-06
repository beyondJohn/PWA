import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Config } from '../config';
import { HttpClient, HttpParams } from '@angular/common/http';
class ConnectionStatus {
  public connected?: boolean;
  public slow?: boolean;
  public verySlow?: boolean;
  public requestor: string;
  contructor() { }
}
@Injectable({
  providedIn: 'root'
})
export class CheckNetworkService {
  private connected: boolean;
  private isActive: boolean;
  private connectionStatus: ConnectionStatus;
  constructor(
    private router: Router
    , private _config: Config
    , private _httpClient: HttpClient
  ) { }

  private sendTestServerRequest(): Observable<object> {
    let params = new HttpParams();
    params = params.append('test', 'testing');
    return this._httpClient.post<object>(this._config.urls.apiEndPoint + '/testNetwork', params);
  }
  testNetwork(src: string): ConnectionStatus {
    if (!this.isActive) {
      this.connectionStatus = new ConnectionStatus();
      this.isActive = true;
      this.connectionStatus.requestor = src;
      let connected: boolean;
      let slow: boolean;
      let verySlow: boolean;
      // test network connection
      this.sendTestServerRequest().subscribe(response => {
        if (response['back']) {
          this.connectionStatus.connected = true;
        }
      }, err => { });
      // wait for 1.5 seconds after making server request
      window.setTimeout(() => {
        if (this.connectionStatus.connected) {
          // if server request has returned successfully
          // return connectionStatus;
          this.result();
        }
        else {
          window.setTimeout(() => {
            if (this.connectionStatus.connected) {
              this.result();
            }
            else {
              window.setTimeout(() => {
                if (this.connectionStatus.connected) {
                  this.result();
                }
                else {
                  window.setTimeout(() => {
                    if (this.connectionStatus.connected) {
                      // if it took up to 3 seconds to complete the server request
                      this.connectionStatus.slow = true;
                      this.result();
                      // return connectionStatus;
                    }
                    else {
                      window.setTimeout(() => {
                        if (this.connectionStatus.connected) {
                          // if it took up to 7 seconds to complete the server request
                          this.connectionStatus.verySlow = true;
                          this.result();
                          // return connectionStatus;
                        }
                        else {
                          // after waiting 7 seconds without response from the server report issue with network connection
                          this.result();
                          // return connectionStatus;
                        }
                      }, 5000);
                    }
                  }, 1000);
                }
              }, 250);
            }
          }, 250)
        }
      }, 500);
    }
    return this.connectionStatus;
  }
  private result() {
    this.isActive = false;
    if (this.connectionStatus.requestor === 'login' && this.connectionStatus.connected) {
      if (this.connectionStatus.verySlow === true) {
        alert('Network connection is very slow, please be patient while using meBloggy until network connection improves :-)');
      }
      else if (this.connectionStatus.slow === true) {
        alert('Network connection is slow, please be patient while using meBloggy until network connection improves :-)');
      }
    }
    else if (this.connectionStatus.requestor === 'login') {
      alert('Network Error, please try again later :-)');
    }
    else if (this.connectionStatus.requestor === 'home' && !this.connectionStatus.connected
      || this.connectionStatus.requestor === 'vert' && !this.connectionStatus.connected) {
      alert('Network Error, some features will not be available until network is connected');
    }
    else if (this.connectionStatus.requestor === 'home' && this.connectionStatus.connected
      || this.connectionStatus.requestor === 'vert' && this.connectionStatus.connected) {
      if (this.connectionStatus.verySlow === true) {
        alert('Network connection is very slow, please be patient while using meBloggy until network connection improves :-)');
      }
      else if (this.connectionStatus.slow === true) {
        alert('Network connection is slow, please be patient while using meBloggy until network connection improves :-)');
      }
    }

  }
}
