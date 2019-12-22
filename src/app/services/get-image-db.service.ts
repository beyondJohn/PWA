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

  imagesDBObj: object = {};
  imagesDB = new BehaviorSubject<object>(this.updateDB());
  refreshImagesDB(db): void {
    if (db == null) {
      this.getImages().subscribe(imagesDB => {
        this.imagesDBObj = imagesDB;
        this.imagesDB.next(this.imagesDBObj);
      });
    } else {
      this.imagesDBObj = db;
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
}
