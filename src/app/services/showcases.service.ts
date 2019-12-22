import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShowcasesService {

  constructor(
    private _http: HttpClient
  ) { }

  showcasesObj: object = { showcaseTypesArray: [] };
  showcasesDb = new BehaviorSubject<object>(this.updateshowcasesDb());
  imageObjects = [];
  showcaseTypesArray = [];

  refreshshowcasesDb(imagesDB): void {
    this.imageObjects = [];
    this.showcaseTypesArray = [];
    // get types from imgDB
    this.imageObjects = imagesDB['imagesDB'];
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
}
