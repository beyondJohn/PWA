import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../services/notifications.service';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { ShowcasesService } from '../services/showcases.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InvitationsComponent } from '../invitations/invitations.component';
import { ShareSettingsComponent } from '../share-settings/share-settings.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  constructor(
    public dialog: MatDialog
    , public dialogRef: MatDialogRef<PeopleComponent>
    , private http: HttpClient
    , public _notification: NotificationsService
    , private _behaviorSubject: BehaviorSubjectService
    , private _showcases: ShowcasesService
  ) { }

  connections = [];
  activeInvitations = [];
  notify = [];
  showcases = [];
  checkboxShowcases = [];
  search = false;
  personFound: Boolean;
  personFoundStage1: Boolean;
  invalidPerson: Boolean;
  userName: String;
  countConnected: Number;
  inviteUserNumber;
  invitationSent;

  ngOnInit() {
    this._notification.notification.subscribe(notify => {
      // notify is an array of invitations with 4 properties: date, inviterName, status,userNumber
      this.notify = notify;
      this.buildInvitations(notify);
      this.buildConnections();
    });
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    });
    this._behaviorSubject.acceptedInvite.subscribe(accepted => {
      if (accepted !== undefined) {
        if (accepted['accept'] === 'accept') {
          // reset accepted value
          this._behaviorSubject.refreshAccepted({ accept: '' });
          this.dialogRef.close();
        }
      }
    });
  }
  buildInvitations(notify) {
    // notify is an array of invitations with 4 properties: date, inviterName, status,userNumber
    notify.forEach(notification => {
      if (notification.status === '0') {
        this.activeInvitations.push(notification);
      }
    });
    this.countSent();
  }
  buildConnections() {
    const id = localStorage.getItem('acc');
    this.http.get('https://switchmagic.com:4111/getImages?id=' + id)
      .subscribe(imagesDB => {
        // get connections from JSON
        imagesDB['people'].connections.forEach(connection => {
          if (connection.status === '1') {
            this.connections.push(connection);
          }
        });
        this.countConnected = this.connections.length;
      });
  }
  viewInvitation(inviterNumber) {
    console.log('notify: ', this.notify);
    this.dialog.open(InvitationsComponent, { data: { notify: this.notify, inviterNumber: inviterNumber } });
  }
  viewPerson(userNumber, userName) {
    console.log(userNumber);
    this.dialog.open(ShareSettingsComponent, { data: { userNumber: userNumber, userName: userName } });
  }
  addPeople() {
    this.search = !this.search;
  }
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

  searchPeople(form: NgForm) {
    this.invalidPerson = undefined;
    const searchTerm = JSON.stringify(form.value);
    const token = localStorage.getItem('jwt');
    this.http.post('https://switchmagic.com/api/customers', searchTerm, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      if (localStorage.getItem('acc') !== null) {
        if (String(response['userNumber']) === localStorage.getItem('acc')) {
          alert("You can't send invitations to yourself. You need to get out more, make some friends ;-)");
          this.dialogRef.close();
        }

        const imgDb = JSON.parse(localStorage.getItem('imagesDB'));
        let connectionAlreadyExists;
        imgDb['people']['connections'].forEach(connection => {
          // check if user already a connection
          if (connection.inviterNumber === String(response['userNumber'])) {
            connectionAlreadyExists = true;
          }
        });
        if (connectionAlreadyExists) {
          alert('You are already connected to ' + response['userName'] + '!');
          this.dialogRef.close();
        }
        if (connectionAlreadyExists === undefined) {
          // check for pending invitations and declined invitations
          imgDb['people']['invitations']['received'].forEach(receivedInvitation => {
            if (receivedInvitation.userNumber === String(response['userNumber'])) {
              // already received invitation, check status
              // if not yet accepted/declined
              if (receivedInvitation.status === '0') {
                alert('You already have a pending invitation from ' + response['userName'] + '. Please repond to the existing invitation');
                this.dialogRef.close();
              } else if (receivedInvitation.status === '2') {// if already declined
                const myConfirm = confirm('You have already declined an invitation from ' + response['userName'] + '. Would you like to continue with sending this invitation?');
                if (myConfirm === true) {

                } else {
                  this.dialogRef.close();
                }
              }
            }
          });
          if (response['found']) {
            // let searchTerm = JSON.stringify(form.value);
            this.personFound = true;
            this.personFoundStage1 = true;
            this.userName = form.value['username'];
            this.inviteUserNumber = String(response['userNumber']);
          } else {
            console.log('user not found, try again');
            this.invalidPerson = true;
          }
        }
      } else {

      }
    }, err => {
      console.log('Something went wrong');
    });
  }

  sendInvite(inviteeUserName) {
    const acc = localStorage.getItem('acc');
    const idName = localStorage.getItem('userName');
    this.http.post('https://switchmagic.com:4111/api/invite', {
      userNumber: this.inviteUserNumber
      , id: acc
      , showcaseArray: JSON.stringify(this.checkboxShowcases)
      , idName: idName
      , inviteeUserName: inviteeUserName
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      console.log('response: ', response);
      console.log('response["back"]: ', response['back']);
      localStorage.setItem('imagesDB', response['back']);
      this.countSent();
      this.countReceived();
      this.personFound = undefined;
      this.invitationSent = true;
    }, err => {
      console.log('Something went wrong');
    });
  }
  clearSearch() {
    this.personFound = undefined;
    this.personFoundStage1 = undefined;
    this.userName = undefined;
    this.invalidPerson = undefined;
    this.search = false;
  }
  countSent() {
    let count = 0;
    let db = localStorage.getItem('imagesDB');
    if (db !== null) {
      db = JSON.parse(db);
      db['people']['invitations']['sent'].forEach(sentInvite => {
        if (sentInvite.status === '0') {
          count++;
        }
      });
      return count;
    }
  }
  countReceived() {
    let count = 0;
    let db = localStorage.getItem('imagesDB');
    if (db !== null) {
      db = JSON.parse(db);
      db['people']['invitations']['received'].forEach(sentInvite => {
        if (sentInvite.status === '0') {
          count++;
        }
      });
      return count;
    }
  }
  getUserName4UI() {

    if (this.userName) {
      return this.userName.toUpperCase();
    }
    return;
  }

}
