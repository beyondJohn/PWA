import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, query, group, animateChild } from '@angular/animations';
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
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '-100%' })
        ], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ left: '100%' }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-out', style({ left: '0%' }))
          ], { optional: true })
        ]),
        query(':enter', animateChild(), { optional: true }),
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
    if (outlet.activatedRouteData.animation === undefined) {
      return null;
    }
    return outlet.activatedRouteData.animation;
  }
}
