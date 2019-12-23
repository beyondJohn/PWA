import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { VertScrollComponent } from './vert-scroll/vert-scroll.component';

import { AuthGuardService } from './services/auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'newacc',
    component: CreateAccountComponent,
    data: { title: 'NewAccount', animation: 'newacc' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home', animation: 'home' },
    canActivate: [AuthGuardService]
  },
  {
    path: 'upload',
    component: FileUploadComponent,
    data: { title: 'Upload', animation: 'upload' },
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login', animation: 'login' }
  },
  {
    path: 'vert',
    component: VertScrollComponent,
    data: { title: 'Vert', animation: 'vert' },
    canActivate: [AuthGuardService]
  },
  {
    path: 'account',
    component: AccountComponent,
    data: { title: 'Account', animation: 'account' },
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
