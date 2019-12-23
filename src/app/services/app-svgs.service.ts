import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppSvgsService {

  constructor(
    iconRegistry: MatIconRegistry
    , sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/examples/thumbup-icon.svg'));
    iconRegistry.addSvgIcon(
      'dialpad',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/examples/dialpadSharp.svg'));
    iconRegistry.addSvgIcon(
      'voicemail',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/examples/voicemailSharp.svg'));
    iconRegistry.addSvgIcon(
      'notification',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/examples/notification.svg'));
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/examples/menu.svg'));
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/home.svg'));
    iconRegistry.addSvgIcon(
      'upload',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/upload.svg'));
    iconRegistry.addSvgIcon(
      'settings',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/settings.svg'));
    iconRegistry.addSvgIcon(
      'account',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/account.svg'));
    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/delete.svg'));
    iconRegistry.addSvgIcon(
      'list',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/list.svg'));
    iconRegistry.addSvgIcon(
      'menu2',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/menu2.svg'));
    iconRegistry.addSvgIcon(
      'visible',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/visibility.svg'));
    iconRegistry.addSvgIcon(
      'visibleoff',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/visibility_off.svg'));
    iconRegistry.addSvgIcon(
      'people',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/people.svg'));
    iconRegistry.addSvgIcon(
      'person_add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/person_add.svg'));
    iconRegistry.addSvgIcon(
      'thumb_up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/thumb_up.svg'));
    iconRegistry.addSvgIcon(
      'notifications_active',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/notifications_active.svg'));
    iconRegistry.addSvgIcon(
      'notifications',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/notifications.svg'));
    iconRegistry.addSvgIcon(
      'remove',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/remove_circle.svg'));
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/materialIconsSVGs/add_circle.svg'));
   }
}
