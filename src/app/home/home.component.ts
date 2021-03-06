import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { Router } from '@angular/router';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { EditComponent } from '../edit/edit.component'
import { ShowcasesService } from '../services/showcases.service';
import { NotificationsService } from '../services/notifications.service';
import { Config } from '../config';
import { GetImageDbService } from '../services/get-image-db.service';
import { CheckNetworkService } from '../services/check-network.service';
import { ImagesDBModel } from '../models/showcaseDbModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private Subscriptions = new Subscription();
  private miniThumbnailDb: ImagesDBModel[] = [];
  showcases = [];
  constructor(
    public dialog: MatDialog
    , private http: HttpClient
    , private _behaviorSubject: BehaviorSubjectService
    , private _showcaseTypesService: ShowcasesService
    , private _router: Router
    , private _notification: NotificationsService
    , private _config: Config
    , private _getImageDb: GetImageDbService
    , private _checkNetwork: CheckNetworkService
  ) {
    this.description = "";
    this.imgAPI = this._config.urls.getImgAPI;
    this.userId = localStorage.getItem("acc");
  }
  myPosition = [];
  imageObjects = [];
  db = [];
  dbTypesArray = [];
  description;
  date;
  comment;
  imgAPI;
  imgSrcType = "/thumbMd";
  userId;
  ngOnInit() {
    this._checkNetwork.testNetwork('home');
    var storedImage = localStorage.getItem('DefaultImage');
    if (storedImage != null) {
      this.description = storedImage.split('---')[3];
      this.date = storedImage.split('---')[4];
      this.comment = storedImage.split('---')[5];
    }
    if(localStorage.getItem('DefaultImageURL') !== null){
      this.url = localStorage.getItem('DefaultImageURL')
    }
  }
  afterInit;
  deleted;
  ngAfterViewInit() {
    let that = this;
    const deleteBehaviorSubject = this._behaviorSubject.delete.subscribe(deleted => {
      if (deleted !== undefined) {
        if (deleted['refresh'] != 'refresh') {
          this.deleted = true;
          this._getImageDb.refreshImagesDB(JSON.parse(deleted['refresh']));
          this._behaviorSubject.refreshDelete({ refresh: 'refresh' });
        }
      }
    })
    this.Subscriptions.add(deleteBehaviorSubject);
    const acceptedInviteBehaviorSubject = this._behaviorSubject.acceptedInvite.subscribe(event => {
      setTimeout(() => {
        this._getImageDb.refreshImagesDB(this.db);
      }, 200);
    });
    this.Subscriptions.add(acceptedInviteBehaviorSubject);
    this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      that.showcases = [];

      showcases['showcaseTypesArray'].forEach(typeObj => {
        that.showcases.push(typeObj);
      });
    });

    const imagesDBBehaviorSubject = this._getImageDb.imagesDB.subscribe(imagesDB => {
      if (this.afterInit) {
        var storedImage = localStorage.getItem('DefaultImage');
        if (storedImage != null) {
          this.description = storedImage.split('---')[3];
          this.date = storedImage.split('---')[4];
          this.comment = storedImage.split('---')[5];
        }
        setTimeout(() => {
          localStorage.setItem('imagesDB', JSON.stringify(imagesDB));
          this.processImages(imagesDB);
          this.processShowcaseTypes(imagesDB);
          this.processNotifications(imagesDB);

        }, 200);
      }
      this.afterInit = true;
    });
    this.Subscriptions.add(imagesDBBehaviorSubject);
  }
  ngOnDestroy() {
    this.Subscriptions.unsubscribe();
  }
  getShowcaseForMiniThumbnail() {
    try {
      const showcaseType = localStorage.getItem('DefaultImage').split("---")[2];
      if (showcaseType !== null) {
        const db = JSON.parse(localStorage.getItem('imagesDB'));
        const imagesDb = db['imagesDB'] as ImagesDBModel[];
        this.miniThumbnailDb = imagesDb.filter(x => x.type.toUpperCase() === showcaseType).reverse();
        if (this.miniThumbnailDb.length === 0) {
          const sharedDefaultImage = localStorage.getItem('DefaultImage').split("---");
          const sharedShowcaseType = sharedDefaultImage[2] + '---' + sharedDefaultImage[3] + '---' + sharedDefaultImage[4];
          this.miniThumbnailDb = imagesDb.filter(x => x.type.toUpperCase() === sharedShowcaseType).reverse();
        }
        return this.miniThumbnailDb;
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
    return;

  }
  cleanShowcaseTitle(showcaseTitle) {
    return "Shared By: " + showcaseTitle.split("---")[1] + "-" + showcaseTitle.split("---")[2];
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
  isMyImgInit = true;
  url;
  setdate;
  desc;
  comm;
  type;
  image;
  timestamp;
  myImg() {

    // set default home main showcase image if exists in localstorage, else load first img from first showcase
    if (this.isMyImgInit) {
      if (this.db.length > 0) {
        if (localStorage.getItem("DefaultImage")) {
          if (localStorage.getItem("DefaultImage").split("---").length === 6) {
            var showcaseType = localStorage.getItem("DefaultImage").split("---")[2].toUpperCase();
            for (var i = 0; i < this.db.length; i++) {
              if (this.db[i][0].type == showcaseType) {
                var timestamp = localStorage.getItem("DefaultImage").split("---")[0];
                var imgName = localStorage.getItem("DefaultImage").split("---")[1];
                for (var r = 0; r < this.db[i].length; r++) {
                  if (this.db[i][r]["timestamp"] == timestamp && this.db[i][r]["image"] == imgName) {
                    this.myPosition = [i, r];
                  }
                }
              }
            }
          }
          else { // shared showcase
            const sharedDefaultImage = localStorage.getItem('DefaultImage').split("---");
            const sharedShowcaseType = sharedDefaultImage[2] + '---' + sharedDefaultImage[3] + '---' + sharedDefaultImage[4];
            for (var i = 0; i < this.db.length; i++) {
              if (this.db[i][0].type == sharedShowcaseType) {
                var timestamp = localStorage.getItem("DefaultImage").split("---")[0];
                var imgName = localStorage.getItem("DefaultImage").split("---")[1];
                for (var r = 0; r < this.db[i].length; r++) {
                  if (this.db[i][r]["timestamp"] == timestamp && this.db[i][r]["image"] == imgName) {
                    this.myPosition = [i, r];
                  }
                }
              }
            }
          }

        }
        this.isMyImgInit = !this.isMyImgInit;
      }
    }

    // check if array of showcases 'db' is loaded before attempting to access each showcase's image objects  
    if (this.db.length > 0) {
      // set string values for description, date, & comment before returning the image url to the view
      //localStorage.setItem("activeType", this.db[this.myPosition[0]][this.myPosition[1]].type);
      if (localStorage.getItem("DefaultImage") != undefined) {
        if (this.myPosition.length == 0) {
          this.myPosition = [0, 0];
        }
        if (localStorage.getItem("DefaultImage").indexOf(this.db[this.myPosition[0]][this.myPosition[1]].image) != -1) {
          var showcaseType = localStorage.getItem("DefaultImage").split("---")[2].toUpperCase();
          for (var i = 0; i < this.db.length; i++) {
            if (this.db[i][0].type == showcaseType) {
              var timestamp = localStorage.getItem("DefaultImage").split("---")[0];
              var imgName = localStorage.getItem("DefaultImage").split("---")[1];
              for (var r = 0; r < this.db[i].length; r++) {
                if (this.db[i][r]["timestamp"] == timestamp && this.db[i][r]["image"] == imgName) {
                  if (this.deleted != undefined) {
                    this.myPosition = [0, 0];
                    localStorage.setItem("DefaultImage",
                      this.db[0][0]["timestamp"]
                      + "---" + this.db[0][0]["image"]
                      + "---" + this.db[0][0]["type"]
                      + "---" + this.db[0][0]["description"]
                      + "---" + this.db[0][0]["date"]
                      + "---" + this.db[0][0]["comment"]
                    );
                    this.deleted = undefined;
                  }
                  else {
                    this.myPosition = [i, r];
                  }
                }
              }
            }
          }
          this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
          this.desc = this.db[this.myPosition[0]][this.myPosition[1]].description;
          this.comm = this.db[this.myPosition[0]][this.myPosition[1]].comment;
          this.type = this.db[this.myPosition[0]][this.myPosition[1]].type;
          this.image = this.db[this.myPosition[0]][this.myPosition[1]].image;
          this.timestamp = this.db[this.myPosition[0]][this.myPosition[1]].timestamp;
          this.url = this.db[this.myPosition[0]][this.myPosition[1]].url;
          localStorage.setItem('DefaultImageURL',this.url);
        }
      }
      //return 
    }
    return this.url;
  }
  updateImgFromMiniThumbnail(i) {
    // get image via passed index
    let showcaseType: string;


    if (this.miniThumbnailDb.length > 0) {
      if (localStorage.getItem("DefaultImage").split("---").length === 6) {
        showcaseType = this.miniThumbnailDb[i].type;
      }
      else {// shared showcase
        const sharedDefaultImage = localStorage.getItem('DefaultImage').split("---");
        showcaseType = sharedDefaultImage[2] + '---' + sharedDefaultImage[3] + '---' + sharedDefaultImage[4];
      }
      // get showcase index
      const showcasetypes = JSON.parse(localStorage.getItem('showcasetypes'));
      if (showcasetypes.length > 0) {
        let tempShowcaseIndex = 0;
        let tempShowcaseAdder = 0;
        showcasetypes.forEach(showcaseObj => {
          if (showcaseObj['viewValue'] === showcaseType) {
            tempShowcaseIndex = tempShowcaseAdder;
          }
          tempShowcaseAdder++;
        });
        this.updateImg(tempShowcaseIndex, i, true);
      }
    }
  }
  updateImg(s, i, fromMini) {

    this.myPosition = [s, i];
    var top = document.getElementById("card").offsetTop + 10; //Getting Y of target element
    window.scrollTo({
      top: top,
      behavior: 'smooth',
    });
    if (this.db.length > 0) {
      this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
      this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
      this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;

      localStorage.setItem("DefaultImage", this.db[this.myPosition[0]][this.myPosition[1]].timestamp
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].image
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].type
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].description
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].date
        + "---" + this.db[this.myPosition[0]][this.myPosition[1]].comment
      );
      if (!fromMini) {
        let scrollLength = 0;
        document.getElementById('miniScroll').scrollLeft = scrollLength;
        let imageFound = false;
        const myScrollDivChildImageNodes = document.getElementById('miniScroll').childNodes;
        // for some reason angular puts an empty html comment in the miniScroll div
        // so we skip the first object in the array which is the html comment 
        for (var image = 1; image < myScrollDivChildImageNodes.length; image++) {
          const myImage = myScrollDivChildImageNodes[image] as HTMLImageElement;
          const imageWidth = myImage.width;
          // check if current selected image
          if (this.currentImageName(myScrollDivChildImageNodes[image])) {
            imageFound = true;
          }
          if (!imageFound) {
            scrollLength += Number(imageWidth);
          }
          else {
            scrollLength = scrollLength - Number(imageWidth);
          }
        }
        document.getElementById('miniScroll').scrollLeft = scrollLength * .5;
      }
    }
  }
  processImages(imagesDB) {
    this.db = [];
    this.dbTypesArray = []
    this.imageObjects = imagesDB["imagesDB"];
    if (this.imageObjects.length > 0) {
      // Begin sort images into showcase arrays & add image types to type array
      this.imageObjects.forEach(imgObj => {
        if (this.dbTypesArray.indexOf(imgObj.type) == -1) {
          this.dbTypesArray.push(imgObj.type);
        }
      });
      for (let i = 0; i < this.dbTypesArray.length; i++) {
        let tempShowcase = [];
        this.imageObjects.forEach(imageObj => {
          if (imageObj.type.toUpperCase() == this.dbTypesArray[i].toUpperCase()) {
            imageObj.type = imageObj.type.toUpperCase();
            tempShowcase.push(imageObj);
          }
        });
        this.db.push(tempShowcase.reverse());
      }

      // End sort & organize image types into type arrays
      if (this.db.length > 0) {
        if (localStorage.getItem('DefaultImage') != undefined) {
          var storedImage = localStorage.getItem('DefaultImage');
          this.type = storedImage.split('---')[2];
          this.description = storedImage.split('---')[3];
          this.date = storedImage.split('---')[4];
          this.comment = storedImage.split('---')[5];
        }
        else {
          this.myPosition = [0, 0]
          this.description = this.db[this.myPosition[0]][this.myPosition[1]].description;
          this.date = this.db[this.myPosition[0]][this.myPosition[1]].date;
          this.comment = this.db[this.myPosition[0]][this.myPosition[1]].comment;
          this.url = this.db[this.myPosition[0]][this.myPosition[1]].url;
        }

      }
    }

  }
  showcaseTitles(showcaseData) {
    try {
      if (showcaseData.viewValue != undefined) {
        return showcaseData.viewValue.indexOf('---') != -1 ? this.cleanShowcaseTitle(showcaseData.viewValue) : showcaseData.viewValue;
      }
    }
    catch{
      // this whole try catch and get images block is a bit of a hack and should be handled more gracefully but I dont have the time or the patience now
      // when user accepts invitation somewhere the shared users showcase titles get lost, but are found if we grab a fresh imagedb from server 
      setTimeout(() => {
        this._getImageDb.refreshImagesDB(this.db);
        // this._getImageDb.getImages().subscribe(imagesDB => {
        //   localStorage.setItem('imagesDB', JSON.stringify(imagesDB));
        //   this.processImages(imagesDB);
        //   this.processShowcaseTypes(imagesDB);
        //   this.processNotifications(imagesDB);
        // });
      }, 100);
    }
    return;
  }
  processShowcaseTypes(imagesDB: Object) {
    this._showcaseTypesService.refreshshowcasesDb(imagesDB);
  }
  notifications = [];
  invitationsSent = [];
  invitationsReceived = [];
  processNotifications(imagesDB: Object) {
    this.invitationsReceived = imagesDB["people"]["invitations"]["received"];
    this.invitationsSent = imagesDB["people"]["invitations"]["sent"];
    let activeReceivedInvites = [];
    this.invitationsReceived.forEach(invitation => {
      if (invitation['status'] == "0") {
        activeReceivedInvites.push(invitation);
      }
    });
    if (activeReceivedInvites.length > 0) {
      this._notification.refreshNotifications(activeReceivedInvites);
    }

    // Begin sort images into showcase arrays & add image types to type array
    this.imageObjects.forEach(imgObj => {
      if (this.dbTypesArray.indexOf(imgObj.type) == -1) {
        this.dbTypesArray.push(imgObj.type);
      }
    });
  }
  openDialog() {
    this.dialog.open(DialogDefaultComponent);
  }
  edit(img) {
    if (this.db[this.myPosition[0]][this.myPosition[1]].isShared) {
      // don't allow editing of images that are shared from other users
    }
    else {
      if (localStorage.getItem('DefaultImage') != undefined) {
        var storedImage = localStorage.getItem('DefaultImage');
        this.type = storedImage.split('---')[2];
        this.description = storedImage.split('---')[3];
        this.date = storedImage.split('---')[4];
        this.comment = storedImage.split('---')[5];
        this.dialog.open(EditComponent, { data: { date: this.date, img: img, description: this.desc, comment: this.comm, type: this.type, timestamp: this.timestamp, image: this.image } });
      }
      else {
        this.dialog.open(EditComponent, { data: { date: this.date, img: img, description: this.desc, comment: this.comm, type: this.type, timestamp: this.timestamp, image: this.image } });
      }
    }
  }
  openVert(type) {
    // vert screen will use activeType to find the correct collection to show
    localStorage.setItem("activeType", type);
    this._router.navigate(['/vert']);
  }
  currentImageName(image) {
    var imgName = localStorage.getItem("DefaultImage").split("---")[1];
    return image === imgName;
  }

}