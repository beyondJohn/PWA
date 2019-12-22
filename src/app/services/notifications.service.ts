import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  notificationDBObj: Array<object> = [];
  notification = new BehaviorSubject<Array<object>>(this.updateNotifications());
  refreshNotifications(notifications): void {
    this.notificationDBObj = notifications;
    this.notification.next(notifications);
  }
  private updateNotifications(): Array<object> {
    return this.notificationDBObj;
  }
}
