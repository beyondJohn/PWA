import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
class Preference {
  userNumber: string;
  showcase: string;
  constructor(userNumber: string, showcase: string) {
    this.userNumber = userNumber;
    this.showcase = showcase;
  }
}
@Injectable({
  providedIn: 'root'
})
export class ShowcasesService {

  constructor(
    private _http: HttpClient
  ) { }

  preferences = [];
  showcasesObj: object = { showcaseTypesArray: [] };
  showcasesDb = new BehaviorSubject<object>(this.updateshowcasesDb());
  imageObjects = [];
  showcaseTypesArray = [];

  refreshshowcasesDb(db): void {
    this.imageObjects = [];
    this.showcaseTypesArray = [];
    // get types from imgDB
    const tempDb = this.processPreferences(db);
    this.imageObjects = tempDb['imagesDB'];
    this.imageObjects.forEach(imgObj => {
      if (this.showcaseTypesArray.indexOf(imgObj.type) === -1) {
        this.showcaseTypesArray.push(imgObj.type);
      }
    });
    this.showcasesObj['showcaseTypesArray'] = [];
    let count = 0;
    this.showcaseTypesArray.forEach(showcaseName => {
      const nameUpper = showcaseName.toUpperCase();
      this.showcasesObj['showcaseTypesArray'].push(
        { value: count, viewValue: nameUpper }
      );
      count++;
    });
    localStorage.setItem('showcasetypes', JSON.stringify(this.showcasesObj['showcaseTypesArray']));
    this.showcasesDb.next(this.showcasesObj);
  }
 
  private updateshowcasesDb(): object {
    return this.showcasesObj;
  }
  processPreferences(db) {
    const tempImagesDb = [];
    const dbCopy = db;

    db['imagesDB'].forEach(() => {
      if (db['preferences']) {
        if (db['preferences']['hide']) {
          db['preferences']['hide'].forEach(hideRecord => {
            if(this.preferences.indexOf(hideRecord.userNumber + '--' + hideRecord.showcase) === -1){
              this.preferences.push(hideRecord.userNumber + '--' + hideRecord.showcase);
            }
          });
        }
      }
    });
    db['imagesDB'].forEach(imageObject => {
      let shouldHide = false;
      if (imageObject.isShared) {
        if(this.preferences.length > 0){
          //401551
          this.preferences.forEach(preference => {
            if (preference === imageObject.type.split('---')[0] + '--' + imageObject.type.split('---')[2]) {
              shouldHide = true;
            }
          });
        }
        if(!shouldHide){
          tempImagesDb.push(imageObject);  
        }
      }
      else{
        tempImagesDb.push(imageObject);
      }
    });
    dbCopy['imagesDB'] = tempImagesDb;
    return dbCopy;
  }
}
