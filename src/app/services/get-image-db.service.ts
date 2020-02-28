import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class GetImageDbService {

  constructor(
    private http: HttpClient
  ) { }
  preferences = [];
  imagesDBObj: object = {};
  unfilteredDb = {};
  imagesDB = new BehaviorSubject<object>(this.updateDB());
  refreshImagesDB(db): void {
    if (db == null || db === undefined || db.length === 0) {
      this.getImages().subscribe(imagesDB => {
        this.unfilteredDb = imagesDB;
        this.imagesDBObj = this.processPreferences(imagesDB);// imagesDB;
        this.imagesDB.next(this.imagesDBObj);
      });
    } else {
      this.unfilteredDb = this.imagesDBObj;
      this.imagesDBObj = this.processPreferences(db)// db;
      this.imagesDB.next(this.imagesDBObj);
    }
  }
  private updateDB(): object {
    return this.imagesDBObj;
  }

  getImages() {
    const id = localStorage.getItem('acc');
    return this.http.get('https://switchmagic.com:4111/getImages?id=' + id);
  }
  getUnfilteredDb() {
    return this.unfilteredDb;
  }
  processPreferences(db) {
    const tempImagesDb = [];
    if(db['imagesDB'] === undefined){
      db = JSON.parse(db);
    }
    const dbCopy = db;
    
    console.log('inside process Preferences db[imagesDB]: ', db['imagesDB']);

    db['imagesDB'].forEach(() => {
      if (db['preferences']) {
        if (db['preferences']['hide']) {
          db['preferences']['hide'].forEach(hideRecord => {
            if (this.preferences.indexOf(hideRecord.userNumber + '--' + hideRecord.showcase) === -1) {
              this.preferences.push(hideRecord.userNumber + '--' + hideRecord.showcase);
            }
          });
        }
      }
    });
    db['imagesDB'].forEach(imageObject => {
      let shouldHide = false;
      if (imageObject.isShared) {
        if (this.preferences.length > 0) {
          //401551
          this.preferences.forEach(preference => {
            if (preference === imageObject.type.split('---')[0] + '--' + imageObject.type.split('---')[2]) {
              shouldHide = true;
            }
          });
        }
        if (!shouldHide) {
          tempImagesDb.push(imageObject);
        }
      }
      else {
        tempImagesDb.push(imageObject);
      }
    });
    dbCopy['imagesDB'] = tempImagesDb;
    return dbCopy;
  }
}
