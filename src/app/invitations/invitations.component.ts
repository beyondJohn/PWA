import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { MatDialogRef } from '@angular/material/dialog';
import { GetImageDbService } from '../services/get-image-db.service';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { NotificationsService } from '../services/notifications.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  notifications = [];
  count = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    , public _showcases: ShowcasesService
    , private _httpClient: HttpClient
    , private _config: Config
    , public dialogRef: MatDialogRef<InvitationsComponent>
    , private _acceptInviteService: BehaviorSubjectService
    , private _getImageDb: GetImageDbService
    , private _notifications: NotificationsService
  ) {
    this.hasInvitation = true;
    this.notifications = this.data.notify;
    this.inviterNumber = this.data.inviterNumber;
    // this.notifications = this.notifications.filter((notification) => { return notification.userNumber == this.inviterNumber });

    this.notifications.forEach(invite => {
      if (invite.status !== '0' && invite.userNumber === this.inviterNumber) {
        // hasInvitation was included before this component was made dynamic, thus it's probably useless
        // and will likely never get to this point
        this.hasInvitation = false;
      }
      if (invite.userNumber === this.inviterNumber) {
        this.filteredNotification.push(invite);
      }
    });
    this.count = this.filteredNotification.length;
  }
  filteredNotification = [];
  preDecision;
  accepted;
  declined;
  showcases = [];
  filteredShowcases = [];
  checkboxShowcases = [];
  inviterName;
  inviterNumber;
  hasInvitation;
  acceptReturnedDb;
  ngOnInit() {
    this.preDecision = true;
    const showcasesDbBehaviorSubject = this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
      this.filterShowcases();
    });
    this.subscriptions.add(showcasesDbBehaviorSubject);
  }
  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
  shareWith() {
    if (this.inviterName !== undefined) {
      return this.inviterName.toUpperCase();
    }

  }
  filterShowcases() {
    this.filteredShowcases = [];
    this.showcases.forEach(showcase => {
      if (showcase.viewValue.indexOf('---') === -1) {
        this.filteredShowcases.push(showcase);
      }
    });
  }
  getInviterName4UI(inviterNumber) {
    let userName;
    this.notifications.forEach(notification => {
      if (inviterNumber === notification.userNumber) {
        this.inviterName = notification.inviterName;
        userName = this.inviterName.toUpperCase();
      }
    });
    return userName;
  }

  accept(inviterNumber) {
    this.notifications.forEach(notification => {
      if (notification.userNumber === inviterNumber) {
        this.inviterName = notification.inviterName;
      }
    });
    // update JSON - set received invite status to 1
    this.updateInvitation('1').subscribe(res => {
      this.preDecision = undefined;
      this.accepted = true;
      this.acceptReturnedDb = JSON.parse(res['back']);
    });
  }
  decline(inviterNumber) {
    // update JSON - set received invite status to 2
    this.updateInvitation('2').subscribe(res => {
      this.preDecision = undefined;
      this.declined = true;
      this.dialogRef.close();
    });
  }

  // this is user by accept & decline functions to reply to invitation
  updateInvitation(status): Observable<void> {
    const inviter = this.inviterNumber;
    const id = localStorage.getItem('acc');
    const userName = localStorage.getItem('userName');
    // Initialize Params Object
    let params = new HttpParams();
    // Begin assigning parameters
    params = params.append('inviter', inviter);
    params = params.append('status', status);
    params = params.append('id', id);
    params = params.append('inviterName', this.inviterName);
    params = params.append('userName', userName);
    return this._httpClient.post<void>(this._config.urls.apiEndPoint + '/invitationResponse', params);
  }

  // the following is used to set showcases to share with inviter
  // which are subsequently listed in people.invitations.sent.sharedShowcases
  setSentRecordShowcase(status): Observable<void> {
    // create a sent invitation record in the db of the user accepting an invitation (this may sonud wacky but its how it works)
    const inviteeNumber = this.inviterNumber;
    const inviteeName = this.inviterName;
    const id = localStorage.getItem('acc');

    const cleanShowcaseTitles = [];
    this.checkboxShowcases.forEach(showcase => {
      cleanShowcaseTitles.push(this.checkBoxLabels(showcase));
    });

    let params = new HttpParams();
    params = params.append('inviteeNumber', inviteeNumber);
    params = params.append('inviteeName', inviteeName);
    params = params.append('status', status);
    params = params.append('id', id);
    params = params.append('showcaseArray', JSON.stringify(cleanShowcaseTitles));
    params = params.append('userName', localStorage.getItem('userName'));
    return this._httpClient.post<void>(this._config.urls.apiEndPoint + '/addsentrecord', params);
  }

  share() {
    // update users people db and add a 'sent' record (even though the user didn't actually send an invite but rather accepted one)
    // and add the showcases the user just selected to share during the accept process
    this.setSentRecordShowcase('1').subscribe(() => {
      // finish accept process & return to home screen
      this._getImageDb.refreshImagesDB(this.acceptReturnedDb);
      this._acceptInviteService.refreshAccepted({ accept: 'accept' });
      this._notifications.refreshNotifications([]);
      this.dialogRef.close();
    });
  }

  // checkbox Utility
  remove(removeValue) {
    const tempArray = [];
    this.checkboxShowcases.forEach(showcase => {
      if (showcase !== removeValue) {
        tempArray.push(showcase);
      }
    });
    this.checkboxShowcases = tempArray;
  }

  checkBox(boxName) {
    if (this.checkboxShowcases.indexOf(boxName) === -1) {
      this.checkboxShowcases.push(boxName);
    } else {
      this.remove(boxName);
    }
  }
  checkBoxLabels(showcase) {
    if (showcase !== undefined) {
      return showcase['viewValue'];
    }
    return;
  }

}
