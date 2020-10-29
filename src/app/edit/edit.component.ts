import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { Observable } from 'rxjs';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowcasesService } from '../services/showcases.service';
import { MatDialog } from '@angular/material';
import { GetImageDbService } from '../services/get-image-db.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    , private _httpClient: HttpClient
    , private _config: Config
    , private _behaviorSubject: BehaviorSubjectService
    , public dialogRef: MatDialogRef<EditComponent>
    , private _showcaseTypesService: ShowcasesService
    , public dialog: MatDialog
    , private _getImageDb: GetImageDbService
  ) {
    this.selectedValue = this.data.type;
    this.describe = this.data.description;
    this.comment = this.data.comment;
    this.date = this.data.date;
  }
  date: string;
  describe: string;
  comment: string;
  selectedValue: string;
  showcases = [];
  ngOnInit() {
    this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        //"515639---TESTACC---FUN"
        if (typeObj['viewValue'].indexOf("---") == -1) {
          this.showcases.push(typeObj);
        }
      });
    });

    let showcaseLocalStorage = localStorage.getItem('showcasetypes');
    if (showcaseLocalStorage) {
      this.showcases = [];
      let tempShowcaseTypes = JSON.parse(showcaseLocalStorage);
      tempShowcaseTypes.forEach(typeObj => {
        if (typeObj['viewValue'].indexOf("---") == -1) {
          this.showcases.push(typeObj);
        }
      });
    }
  }
  delete(img): Observable<void> {
    var userid = localStorage.getItem("acc");
    return this._httpClient.delete<void>(this._config.urls.apiEndPoint + "/delete/" + img + "/userid/" + userid);
  }
  deleteImage(img) {
    let image = this.data.image.replace(".jpg", "") + "---" + this.data.timestamp;
    this.delete(image).subscribe(db => {
      localStorage.setItem('imagesDB', db['back']);
      var returnedDB = JSON.parse(db['back']);
      var setNewDefault;
      var currentShowcaseType = localStorage.getItem('showcaseType');
      // if there is another image of the same showcase type of the deleted image, use it as new default image 
      returnedDB['imagesDB'].forEach(imageObj => {
        if (imageObj['type'] === currentShowcaseType) {
          setNewDefault = imageObj['timestamp']
            + "---" + imageObj['image']
            + "---" + imageObj['type']
            + "---" + imageObj['description']
            + "---" + imageObj['date']
            + "---" + imageObj['comment'];
          localStorage.setItem("showcaseType", imageObj['type']);
          localStorage.setItem("DefaultImage", setNewDefault);
        }
      });
      // if there is not another image of the same showcase type of the deleted image, use the first DB image as the new default image
      if (setNewDefault === undefined) {
        var imageObj = returnedDB['imagesDB'][0];
        setNewDefault = imageObj['timestamp']
          + "---" + imageObj['image']
          + "---" + imageObj['type']
          + "---" + imageObj['description']
          + "---" + imageObj['date']
          + "---" + imageObj['comment'];
        localStorage.setItem("showcaseType", imageObj['type']);
        localStorage.setItem("DefaultImage", setNewDefault);
      }
      this._behaviorSubject.refreshDelete({ refresh: db["back"] });
      this.dialogRef.close();
    });
    this._getImageDb.refreshImagesDB([]);
  }
  update(img): Observable<void> {
    var id = localStorage.getItem("acc");
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('date', this.date);
    params = params.append('image', this.data.image);
    params = params.append('timestamp', this.data.timestamp);
    params = params.append('type', this.selectedValue);
    params = params.append('description', this.describe);
    params = params.append('comment', this.comment);
    params = params.append('id', id);
    localStorage.setItem("activeType", this.selectedValue);
    localStorage.setItem("showcaseType", this.selectedValue);
    localStorage.setItem("DefaultImage", this.data.timestamp
      + "---" + this.data.image
      + "---" + this.selectedValue
      + "---" + this.describe
      + "---" + this.date
      + "---" + this.comment
    );

    return this._httpClient.patch<void>(this._config.urls.apiEndPoint + "/patch", params);
  }
  updateImage(img) {
    let image = this.data.image.replace(".jpg", "") + "---" + this.data.timestamp;
    this.update(image).subscribe(db => {
      // this._getImageDb.refreshImagesDB(JSON.parse(db["back"]));
      this._getImageDb.refreshImagesDB([]);
      this.dialogRef.close();
    });
  }
  imgClick() {
    
  }
}
