import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { CheckBoxModel } from '../models/checkboxmodel';
import { GetImageDbService } from '../services/get-image-db.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-share-settings',
  templateUrl: './share-settings.component.html',
  styleUrls: ['./share-settings.component.css']
})
export class ShareSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();
  constructor(
    public dialog: MatDialog
    , public dialogRef: MatDialogRef<ShareSettingsComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any
    , private _showcases: ShowcasesService
    , private _httpClient: HttpClient
    , private _config: Config
    , private _imagesDb: GetImageDbService
  ) { }
  inviteeName: string;
  showcases: CheckBoxModel[] = [];
  filteredShowcases: CheckBoxModel[] = [];
  filteredSharedShowcases: CheckBoxModel[] = [];
  checkboxShowcases = [];
  imagesDB;
  ngOnInit() {
    this.imagesDB = localStorage.getItem('imagesDB');
    const showcasesDbBehaviorSubject = this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(new CheckBoxModel(typeObj.viewValue, false, typeObj.value));
      });
      this.filterShowcases();
      // this.getFilteredSharedShowcases();
    });
    this.subscriptions.add(showcasesDbBehaviorSubject)
    this.inviteeName = this.data.userName;
    this.buildSharedShowcasesCheckBoxes();
  }
  ngAfterViewInit() {
    // for the dynamic checkboxes, we have to drill into the DOM, if there is a sexier way I'll revise later
    // setTimeout in place do to dev mode change detection error https://github.com/angular/angular/issues/6005
    setTimeout(() => { this.setCheckBoxesInitValues(); }, 200);

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
  buildSharedShowcasesCheckBoxes() {
    var rawSharedShowcase = this.data.sharedshowcases;
    // filter for current connection
    const filteredSharedShowcases = rawSharedShowcase.filter(x => x.userNumber === this.data.userNumber);
    filteredSharedShowcases.forEach(connectionObj => { //connection object has 2 properties, a string userNumber, and an array showcaseArray
      connectionObj.showcaseArray.forEach(showcaseName => {
        this.filteredSharedShowcases.push(new CheckBoxModel(showcaseName, true, this.data.userNumber));
      });

    });
    // Uncheck the boxes dependent on the db preference hide value
    const db = JSON.parse(this.imagesDB);
    if (db['preferences']) {
      const preferencesHideArray = db['preferences']['hide'];
      const currentInviteeHide = preferencesHideArray.filter(x => x.userNumber === this.data.userNumber);
      if (currentInviteeHide.length > 0) {
        currentInviteeHide.forEach(hideObj => {
          this.filteredSharedShowcases.forEach(checkboxObj => {
            if (checkboxObj.value == hideObj.userNumber
              && checkboxObj.viewValue.indexOf(hideObj.showcase) !== -1) {
              checkboxObj.checked = false;
            }
          })
        })
      }
    }
  }

  // the following is used to update showcases listed in people.invitations.sent.sharedShowcases
  updateShowcaseSentRecord(status): Observable<void> {
    const inviteeNumber = this.data.userNumber;
    const inviteeName = this.data.userName;
    const id = localStorage.getItem('acc');
    let params = new HttpParams();
    params = params.append('inviteeNumber', inviteeNumber);
    params = params.append('inviteeName', inviteeName);
    params = params.append('status', status);
    params = params.append('id', id);
    return this._httpClient.post<void>(this._config.urls.apiEndPoint + '/updatesentrecord', params);
  }

  filterShowcases() {
    this.filteredShowcases = [];
    this.showcases.forEach(showcase => {
      if (showcase.viewValue.indexOf('---') === -1) {
        this.filteredShowcases.push(showcase);
      }
    });
  }

  // this is a complicated  process due to dynamic checkboxes using material
  setCheckBoxesInitValues() {
    this.filteredShowcases.forEach(showcase => {
      const showcaseTitle = showcase.viewValue;
      // get sent invitation from people db
      const db = JSON.parse(this.imagesDB);
      if (db['people']['invitations']['sent'].length > 0) {
        db['people']['invitations']['sent'].forEach(invitation => {
          if (invitation['userNumber'] === this.data.userNumber) {
            // get shared showcases
            invitation['sharedShowcases'].forEach(myShowcaseTitle => {
              if (myShowcaseTitle === showcaseTitle) {
                showcase.checked = true;
                if (this.checkboxShowcases.indexOf(showcase) === -1) {
                  this.checkboxShowcases.push(showcase);
                }
              }
            });
          }
        });
      }
    });
  }

  // save the user preference os which showcases to share with a given connection(person)
  saveSettings() {
    const db = JSON.parse(this.imagesDB);
    db['people']['connections'].forEach(connection => {
      if (connection['inviterNumber'] === this.data.userNumber) {
        const inviteeNumber = this.data.userNumber;
        const inviteeName = this.data.userName;
        const id = localStorage.getItem('acc');
        const showcases = [];
        this.checkboxShowcases.forEach(showcase => {
          showcases.push(showcase.viewValue);
        });
        let params = new HttpParams();
        params = params.append('inviteeNumber', inviteeNumber);
        params = params.append('inviteeName', inviteeName);
        params = params.append('showcases', JSON.stringify(showcases));
        params = params.append('id', id);
        this._httpClient.post<void>(this._config.urls.apiEndPoint + '/updatesharedshowcases', params).subscribe(res => {
          this._imagesDb.refreshImagesDB([]);
          this.imagesDB = res['back'];
          this.dialogRef.close();
        });
      }
    });
    // save show hide settings
    let params = new HttpParams();
    params = params.append('inviteeNumber', this.data.userNumber);
    params = params.append('inviteeName', this.data.userName);
    const id = localStorage.getItem('acc');
    params = params.append('id', id);
    params = params.append('filteredSharedShowcases', JSON.stringify(this.filteredSharedShowcases));
    this._httpClient.post<void>(this._config.urls.apiEndPoint + '/updateShowHideShared', params).subscribe(res => {
      this._imagesDb.refreshImagesDB(res['back']);
      this.imagesDB = res['back'];
      this.dialogRef.close();
    });
  }

  // checkbox Utility, nuts and bolts going on below here shouldn't be edited
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
}
