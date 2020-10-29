import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { EditComponent } from '../edit/edit.component';
import { ShowcasesService } from '../services/showcases.service';
import { CheckNetworkService } from '../services/check-network.service';
import { GetImageDbService } from '../services/get-image-db.service';
import { ImagesDBModel } from '../models/showcaseDbModel';
import { Subscription } from 'rxjs';

export interface Showcase {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-vert-scroll',
  templateUrl: './vert-scroll.component.html',
  styleUrls: ['../home/home.component.css']
})
export class VertScrollComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  showcases: Showcase[] = [
    { value: '0', viewValue: 'Family' },
    { value: '1', viewValue: 'Friends' },
    { value: '2', viewValue: 'Fun' },
    { value: '3', viewValue: 'Food' },
    { value: '4', viewValue: 'Nature' }
  ];
  constructor(
    public dialog: MatDialog
    , private _behaviorSubject: BehaviorSubjectService
    , private _showcaseTypesService: ShowcasesService
    , private _checkNetwork: CheckNetworkService
    , private _getImageDb: GetImageDbService
  ) { }
  myPosition = [0];
  imageObjects = [];
  db = [];
  dbTypesArray = [];
  description = "meBloggy";
  date = "Thursday December 26, 2018";
  comment = "";
  activeType;
  src = "";
  private miniThumbnailDb: ImagesDBModel[] = [];
  getShowcaseForMiniThumbnail() {
    try {
      if (localStorage.getItem('activeType') !== null) {
        const sharedActiveType = localStorage.getItem('activeType').split(":");
        if (sharedActiveType.length > 1) {
          const sharedShowcaseType = sharedActiveType[1].trim();
          const finalSharedShowcaseTypeArray = sharedShowcaseType.split('-');
          const finalSharedShowcaseType = finalSharedShowcaseTypeArray[0] + "---" + finalSharedShowcaseTypeArray[1];
          const db = JSON.parse(localStorage.getItem('imagesDB'));
          const imagesDb = db['imagesDB'] as ImagesDBModel[];
          this.miniThumbnailDb = imagesDb.filter(x => x.type.toUpperCase().indexOf(finalSharedShowcaseType) !== -1).reverse();
          return this.miniThumbnailDb;
        }
        else {
          const showcaseType = localStorage.getItem('activeType');
          const db = JSON.parse(localStorage.getItem('imagesDB'));
          const imagesDb = db['imagesDB'] as ImagesDBModel[];
          this.miniThumbnailDb = imagesDb.filter(x => x.type.toUpperCase() === showcaseType).reverse();
          return this.miniThumbnailDb;
        }

      }
      else {
        setTimeout(() => {
          this._getImageDb.refreshImagesDB(this.db);
        }, 100);
      }
    }
    catch{
      // this whole try catch and get images block is a bit of a hack and should be handled more gracefully but I dont have the time or the patience now
      // when user accepts invitation somewhere the shared users showcase titles get lost, but are found if we grab a fresh imagedb from server 
      setTimeout(() => {
        this._getImageDb.refreshImagesDB(this.db);
      }, 100);
    }
    return this.miniThumbnailDb;
  }

  myImg() {
    // check if array of showcases 'db' is loaded before attempting to access each showcase's image objects  
    if (this.db.length > 0) {
      if (this.db[0].length > 0) {
        // set string values for description, date, & comment before returning the image url to the view
        this.description = this.db[0][this.myPosition[0]].description;
        this.date = this.db[0][this.myPosition[0]].date;
        this.comment = this.db[0][this.myPosition[0]].comment;
        return this.db[0][this.myPosition[0]].url;
      }
    }
    return "";
  }
  updateImg(i) {
    this.myPosition = [i];

    var top = document.getElementById("card").offsetTop + 10; //Getting Y of target element
    window.scrollTo({
      top: top,
      behavior: 'smooth',
    });
  }
  processImages(imagesDB) {
    this.db = [];
    this.dbTypesArray = []
    if (!imagesDB["imagesDB"]) {
      this._getImageDb.refreshImagesDB(null);
      return;
    }
    else {
      this.imageObjects = imagesDB["imagesDB"];
      // Begin sort only 1 type of images into showcase array 
      let tempShowcase = [];
      this.imageObjects.forEach(imageObj => {
        if (localStorage.getItem('activeType').indexOf('Shared By: ') === -1) {
          if (localStorage.getItem("DefaultImage")) {
            if (localStorage.getItem("DefaultImage").split("---").length === 6) {
              if (imageObj.type.toUpperCase() == this.activeType) {
                tempShowcase.push(imageObj);
              }
            }
          }
        } else {
          const sharedActiveType = localStorage.getItem('activeType').split(":");
          const sharedShowcaseType = sharedActiveType[1].split('-');
          this.activeType = sharedActiveType[1];
          if (imageObj.type.toUpperCase().indexOf(sharedShowcaseType[0].trim() + "---" + sharedShowcaseType[1]) !== -1) {
            tempShowcase.push(imageObj);
          }
        }
      });
      this.db.push(tempShowcase.reverse());
      this.myPosition = [0];
      // End sort only 1 type of images into showcase array 
    }

  }
  getImages() {

  }
  ngOnInit() {
    this._checkNetwork.testNetwork('vert');
    this.activeType = localStorage.getItem("activeType").toUpperCase();
    this.getImages();
    const imagesDBBehaviorSubject = this._getImageDb.imagesDB.subscribe(imagesDB => { this.processImages(imagesDB); });
    this.subscriptions.add(imagesDBBehaviorSubject);
    let that = this;
    const elementsBehaviorSubject = this._behaviorSubject.elements.subscribe(event => {
      setTimeout(function () {
        that.getImages();
      }, 1000);

    });
    this.subscriptions.add(elementsBehaviorSubject);
    const showcasesDBBehaviorSubject = this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    });
    this.subscriptions.add(showcasesDBBehaviorSubject);
    let showcaseLocalStorage = localStorage.getItem('showcasetypes');
    if (showcaseLocalStorage) {
      this.showcases = [];
      let tempShowcaseTypes = JSON.parse(showcaseLocalStorage);
      tempShowcaseTypes.forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    }

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  openDialog() {
    this.dialog.open(DialogDefaultComponent);
  }
  // edit(img) {
  //   let desc = this.db[0][this.myPosition[0]].description;
  //   let comm = this.db[0][this.myPosition[0]].comment;
  //   let type = this.db[0][this.myPosition[0]].type;
  //   let image = this.db[0][this.myPosition[0]].image;
  //   let timestamp = this.db[0][this.myPosition[0]].timestamp;
  //   this.dialog.open(EditComponent, { data: { img: img, description: desc, comment: comm, type: type, timestamp: timestamp, image: image } });
  // }
  currentImageName(image) {
    return image.image === this.db[0][this.myPosition[0]].image;

  }

}
