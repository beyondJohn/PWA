import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import {
  MatFormFieldModule, MatInputModule, MatRippleModule, MatIconModule
  , MatDialogModule, MatCardModule, MatProgressSpinnerModule, MatToolbarModule
  , MatButtonModule, MatSelectModule, MatCheckboxModule

} from '@angular/material';
export function jwtTokenGetter() {
  return localStorage.getItem('token');
}
const matModules = [
  MatFormFieldModule, MatInputModule, MatRippleModule, MatIconModule
  , MatDialogModule, MatCardModule, MatProgressSpinnerModule, MatToolbarModule
  , MatButtonModule, MatSelectModule, MatCheckboxModule
];

import { AuthGuardService } from './services/auth-guard.service';
import { AppSvgsService } from './services/app-svgs.service';
import { BehaviorSubjectService } from './services/behavior-subject.service';
import { NotificationsService } from './services/notifications.service';
import { ShowcasesService } from './services/showcases.service';
import { GetImageDbService } from './services/get-image-db.service';

import { Config } from './config';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DialogDefaultComponent } from './dialog-default/dialog-default.component';
import { AccountComponent } from './account/account.component';
import { PeopleComponent } from './people/people.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { ShareSettingsComponent } from './share-settings/share-settings.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditComponent } from './edit/edit.component';
import { NotificationComponent } from './notification/notification.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { VertScrollComponent } from './vert-scroll/vert-scroll.component';

@NgModule({
  declarations: [
    AppComponent
    , DialogDefaultComponent
    , HomeComponent
    , FileUploadComponent
    , LoginComponent
    , AccountComponent, PeopleComponent, InvitationsComponent, ShareSettingsComponent, CreateAccountComponent, EditComponent, NotificationComponent, FilterPipe, ReversePipe, VertScrollComponent
  ],
  imports: [
    AppRoutingModule
    , BrowserModule
    , ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    , BrowserAnimationsModule
    , HttpClientModule
    , RouterModule
    , JwtModule
    , FormsModule
    , ReactiveFormsModule
    , JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter,
        whitelistedDomains: ['localhost:4200', 'switchmagic.com'],
        blacklistedRoutes: ['http://localhost:3000/auth/login']
      }
    })
    , ...matModules
  ]
  , providers: [AppSvgsService, Config, AuthGuardService, BehaviorSubjectService, NotificationsService, ShowcasesService
  , GetImageDbService ]
  , bootstrap: [AppComponent]
  , entryComponents: [DialogDefaultComponent, AccountComponent, ShareSettingsComponent, PeopleComponent
    , InvitationsComponent, EditComponent, NotificationComponent]
})
export class AppModule { }
