import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { Router } from '@angular/router';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { ShowcasesService } from '../services/showcases.service';
import { NotificationsService } from '../services/notifications.service';
import { Config } from '../config';
import { GetImageDbService } from '../services/get-image-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  showcases = [];
  constructor(
    public dialog: MatDialog
    , private jwt: JwtHelperService
    , private _behaviorSubject: BehaviorSubjectService
    , private _showcaseTypesService: ShowcasesService
    , private _router: Router
    , private _notification: NotificationsService
    , private _config: Config
    , private _getImageDb: GetImageDbService
  ) { }

  myPosition = [];
  imageObjects = [];
  db = [];
  dbTypesArray = [];
  description;
  date;
  comment;
  imgAPI;
  imgSrcType = '/thumbMd';
  userId;
  isMyImgInit = true;
  url;
  setdate;
  desc;
  comm;
  type;
  image;
  timestamp;
  afterInit;
  deleted;
  ngOnInit() {
  }
  ngAfterViewInit() {
    const that = this;
    this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      that.showcases = [];

      showcases['showcaseTypesArray'].forEach(typeObj => {
        that.showcases.push(typeObj);
      });
    });

    this._getImageDb.imagesDB.subscribe(imagesDB => {
      console.log('imagesDB: ', Object.keys(imagesDB).length === 0);
      if (Object.keys(imagesDB).length === 0) {
        this._getImageDb.refreshImagesDB(null);
      } else {
        console.log('imagesDB: ', imagesDB);
        localStorage.setItem('imagesDB', JSON.stringify(imagesDB));
        this._showcaseTypesService.refreshshowcasesDb(imagesDB);
      }
      if (this.afterInit) {
        setTimeout(() => {
          localStorage.setItem('imagesDB', JSON.stringify(imagesDB));

          // this.processImages(imagesDB);
          // this.processShowcaseTypes(imagesDB);
          // this.processNotifications(imagesDB);

          // if (localStorage.getItem('DefaultImage')) {
          const storedImage = localStorage.getItem('DefaultImage');
          if (storedImage != null) {
            this.description = storedImage.split('---')[3];
            this.date = storedImage.split('---')[4];
            this.comment = storedImage.split('---')[5];
          }

          // }

          this.processShowcaseTypes(imagesDB);
          // this.processNotifications(imagesDB);
        }, 200);
      }
      // this.afterInit = true;
    });
  }
  processShowcaseTypes(imagesDB: Object) {
    this._showcaseTypesService.refreshshowcasesDb(imagesDB);
  }
  cleanShowcaseTitle(showcaseTitle) {
    return 'Shared By: ' + showcaseTitle.split('---')[1] + '-' + showcaseTitle.split('---')[2];
  }
  // figure out which directory to get images from,
  // might be default /uploads, or owners /uploads/imagesuser#, or from shared user /uploads/imagesinvitors#
  directoryName(imgJSON) {
    if (imgJSON.isSeed) {
      return '';
    }
    // get invitors number from the type string, username & # appended to type string when shared images are compiled
    if (imgJSON.isShared) {
      return '/images' + imgJSON.type.split('---')[0];
    }
    return '/images' + this.userId;
  }
  openDialog() {
    this.dialog.open(DialogDefaultComponent);
  }

}
