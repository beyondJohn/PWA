import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class BehaviorSubjectService {

  constructor() { }

  delete = new BehaviorSubject<object>(this.updateDeletes());
  deleteObj: object = { refresh: 'refresh' };
  imagesDB = new BehaviorSubject<object>(this.updateImagesDB());
  imagesDBObj: object = { refresh: 'refresh' };
  elements = new BehaviorSubject<object>(this.updateElements());
  elementsObj: object = { refresh: 'refresh' };
  acceptedInvite = new BehaviorSubject<object>(this.updateAcceptedInvite());
  acceptedInviteObj: object = { accept: '' };

  refreshDelete(refresh): void {
    this.deleteObj = { refresh: refresh['refresh'] };
    this.delete.next(refresh);
  }
  private updateDeletes(): object {
    return this.deleteObj;
  }

  refreshImagesDB(refresh): void {
    this.imagesDBObj = { refresh: refresh['refresh'] };
    this.imagesDB.next(refresh);
  }
  private updateImagesDB(): object {
    return this.imagesDBObj;
  }

  refreshElements(refresh): void {
    this.elementsObj = { refresh: refresh['refresh'] };
    this.elements.next(refresh);
  }
  private updateElements(): object {
    return this.elementsObj;
  }

  refreshAccepted(accept): void {
    this.acceptedInviteObj = { accept: accept['accept'] };
    this.acceptedInvite.next(accept);
  }
  private updateAcceptedInvite(): object {
    return this.acceptedInviteObj;
  }
}
