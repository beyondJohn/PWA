import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubjectService } from '../services/behavior-subject.service';
import { DialogDefaultComponent } from '../dialog-default/dialog-default.component';
import { EditComponent } from '../edit/edit.component';
import { ShowcasesService } from '../services/showcases.service';
import { CheckNetworkService } from '../services/check-network.service';
import { GetImageDbService } from '../services/get-image-db.service';

export interface Showcase {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-vert-scroll',
  templateUrl: './vert-scroll.component.html',
  styleUrls: ['../home/home.component.css']
})
export class VertScrollComponent implements OnInit {
  showcases: Showcase[] = [
    { value: '0', viewValue: 'Family' },
    { value: '1', viewValue: 'Friends' },
    { value: '2', viewValue: 'Fun' },
    { value: '3', viewValue: 'Food' },
    { value: '4', viewValue: 'Nature' }
  ];
  constructor(
    public dialog: MatDialog
    , private http: HttpClient
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

  myImg() {
    // check if array of showcases 'db' is loaded before attempting to access each showcase's image objects  
    if (this.db.length > 0) {
      if(this.db[0].length > 0){
        console.log('this.db: ', this.db);
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
    this.imageObjects = imagesDB["imagesDB"];

    // Begin sort only 1 type of images into showcase array 
    let tempShowcase = [];
    this.imageObjects.forEach(imageObj => {
      ////
      if (localStorage.getItem('activeType').indexOf('Shared By: ') === -1) {
        console.log('this should only be run on NON-shared showcases');
        if (localStorage.getItem("DefaultImage")) {
          if (localStorage.getItem("DefaultImage").split("---").length === 6) {
            if (imageObj.type.toUpperCase() == this.activeType) {
              tempShowcase.push(imageObj);
            }
          }
        }
      }else{
        var id = localStorage.getItem("acc");
          const sharedActiveType = localStorage.getItem('activeType').split(":");
          console.log('sharedActiveType: ', sharedActiveType)
          const sharedShowcaseType = sharedActiveType[1].split('-');
          console.log('sharedShowcaseType: ', sharedShowcaseType)
          this.activeType = sharedActiveType[1];
          console.log('this.activeType: ', this.activeType)
          console.log('imageObj.type.toUpperCase(): ', imageObj.type.toUpperCase());
          console.log('id + "---" + sharedShowcaseType[0] + "---" + sharedShowcaseType[1]: ', id + "---" + sharedShowcaseType[0].trim() + "---" + sharedShowcaseType[1]);
          if (imageObj.type.toUpperCase().indexOf(sharedShowcaseType[0].trim() + "---" + sharedShowcaseType[1]) !== -1) {
            tempShowcase.push(imageObj);
          }
      }
      ////
    });
    this.db.push(tempShowcase.reverse());
    this.myPosition = [0];
    //this.myImg();
    // End sort only 1 type of images into showcase array 
  }
  getImages() {
    
  }
  ngOnInit() {
    this._checkNetwork.testNetwork('vert');
    this.activeType = localStorage.getItem("activeType").toUpperCase();
    if (this.activeType.indexOf('SHARED BY: ') !== -1) {

    }
    this.getImages();
    this._getImageDb.imagesDB.subscribe(imagesDB => { this.processImages(imagesDB); });
    let that = this;
    this._behaviorSubject.elements.subscribe(event => {
      setTimeout(function () {
        that.getImages();
      }, 1000);

    });
    this._showcaseTypesService.showcasesDb.subscribe(showcases => {
      this.showcases = [];
      showcases['showcaseTypesArray'].forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    });

    let showcaseLocalStorage = localStorage.getItem('showcasetypes');
    if (showcaseLocalStorage) {
      this.showcases = [];
      let tempShowcaseTypes = JSON.parse(showcaseLocalStorage);
      tempShowcaseTypes.forEach(typeObj => {
        this.showcases.push(typeObj);
      });
    }

  }
  openDialog() {
    this.dialog.open(DialogDefaultComponent);
  }
  edit(img) {
    let desc = this.db[0][this.myPosition[0]].description;
    let comm = this.db[0][this.myPosition[0]].comment;
    let type = this.db[0][this.myPosition[0]].type;
    let image = this.db[0][this.myPosition[0]].image;
    let timestamp = this.db[0][this.myPosition[0]].timestamp;
    this.dialog.open(EditComponent, { data: { img: img, description: desc, comment: comm, type: type, timestamp: timestamp, image: image } });
  }

}
