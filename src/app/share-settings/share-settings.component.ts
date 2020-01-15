import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ShowcasesService } from '../services/showcases.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { CheckBoxModel } from '../models/checkboxmodel';

@Component({
  selector: 'app-share-settings',
  templateUrl: './share-settings.component.html',
  styleUrls: ['./share-settings.component.css']
})
export class ShareSettingsComponent implements OnInit, AfterViewInit {

  constructor(
    public dialog: MatDialog
    , public dialogRef: MatDialogRef<ShareSettingsComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any
    , private _showcases: ShowcasesService
    , private _httpClient: HttpClient
    , private _config: Config
  ) { }
  inviteeName: string;
  showcases: CheckBoxModel[] = [];
  filteredShowcases: CheckBoxModel[] = [];
  filteredSharedShowcases: CheckBoxModel[] = [];
  checkboxShowcases = [];
  imagesDB;
  ngOnInit() {
    this.imagesDB = localStorage.getItem('imagesDB');
    this._showcases.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(new CheckBoxModel(typeObj.viewValue, false, typeObj.value));
      });
      this.filterShowcases();
      this.filetrSharedShowcases();
    });
    this.inviteeName = this.data.userName
  }
  ngAfterViewInit() {
    // for the dynamic checkboxes, we have to drill into the DOM, if there is a sexier way I'll revise later
    // setTimeout in place do to dev mode change detection error https://github.com/angular/angular/issues/6005
    setTimeout(() => { this.setCheckBoxesInitValues(); }, 200);

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
  filetrSharedShowcases(){
    const userNumber = this.data.userNumber;
    this.filteredSharedShowcases = this.showcases.filter(x => x.viewValue.indexOf(String(userNumber)) !== -1);
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
          localStorage.setItem('imagesDB', res['back']);
          this.imagesDB = localStorage.getItem('imagesDB');
          this.dialogRef.close();
        });
      }
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
  // checkBoxLabels(showcase) {
  //   if (showcase !== undefined) {
  //     return showcase['viewValue'];
  //   }
  //   return;
  // }

}
