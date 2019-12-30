import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, query } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { AuthGuardService } from './services/auth-guard.service';
import { AppSvgsService } from './services/app-svgs.service';
import { AccountComponent } from './account/account.component';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  , animations: [
    trigger('routerAnimation', [
      transition('* <=> *', [
        // Initial state of new route
        query(':enter',
          style({
            position: 'fixed',
            width: '100%',
            height: '100%',
            opacity: 0,
            transform: 'translateX(-100%)'
          }),
          { optional: true }),
        // move page off screen right on leave
        query(':leave',
          animate('400ms ease',
            style({
              position: 'fixed',
              width: '100%',
              height: '100%',
              opacity: 0,
              transform: 'translateX(100%)'
            })
          ),
          { optional: true }),
        // move page in screen from left to right
        query(':enter',
          animate('400ms ease',
            style({
              opacity: 1,
              transform: 'translateX(0%)'
            })
          ),
          { optional: true }),
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'meBloggy';
  message;
  constructor(
    public dialog: MatDialog
    , private _authService: AuthGuardService
    , private svgs: AppSvgsService
    , private messagingService: MessagingService
  ) {
  }
  ngOnInit() {
    this.messagingService.requestPermission()
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
  }
  openAccount() {
    if (this._authService.canActivate()) {
      this.dialog.open(AccountComponent);
    }
  }
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
}
