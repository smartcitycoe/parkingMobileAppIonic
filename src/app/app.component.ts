import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp } from 'ionic-angular';
import { StatusBar, Splashscreen, Keyboard } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';


@Component({
  templateUrl: 'app.html'

})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, private ionicApp: IonicApp) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Page1 },
      { title: 'My Bookings', component: Page2 }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      Keyboard.disableScroll(true);

      //new solution
      this.platform.registerBackButtonAction(() => {
        let activePortal = this.ionicApp._loadingPortal.getActive() ||
          this.ionicApp._modalPortal.getActive() ||
          this.ionicApp._toastPortal.getActive() ||
          this.ionicApp._overlayPortal.getActive();
        console.log('Ashish: back button pressed');

        if (activePortal) {
          console.log('Ashish: dismissing active portal');
          return activePortal.dismiss();
        }

        let navChild = this.nav.getActiveChildNav();

        while (true) {
          console.log('Ashish: while loop');

          if (!navChild) {
            console.log('Ashish: loop break');
            break;
          }

          if (navChild.canGoBack()) {
            console.log('Ashish:while pop from nav stack');
            return navChild.pop();
          }

          navChild = navChild.getActiveChildNav();
        }

        if (this.nav.canGoBack()) {
          console.log('Ashish: pop from nav stack');
          return this.nav.pop();
        }

        // if (menu.isOpen()) {
        //     return menu.close();
        // }

        // this.confirmExitApp();
      }, 0);
      //new solution




      //editing back button action
      // this.nav.getByIndex(0).component.id=1;
      // this.platform.registerBackButtonAction(() => {

      //   console.log('Ashish: back button pressed');
      //   let activePortal = this.ionicApp._loadingPortal.getActive() ||
      //     this.ionicApp._modalPortal.getActive() ||
      //     this.ionicApp._toastPortal.getActive() ||
      //     this.ionicApp._overlayPortal.getActive();

      //   let view = this.nav.getActive();
      //   let currentRootPage = view.component;


      //   if (activePortal) {
      //     console.log('Ashish: dismissing active portal');
      //     activePortal.dismiss();
      //   }
      //   // else if (this.menuCtrl.isOpen()) {
      //   //   this.menuCtrl.close();
      //   // }
      //   else if (this.nav.canGoBack() || view && view.isOverlay) {
      //     console.log('Ashish: pop from nav stack');
      //     this.nav.pop();
      //   }
      //   else if(currentRootPage != this.pages[0].component) { // Could any other page that you consider as your main one
      //               console.log('Ashish: rootPage');
      //     this.openPage(this.pages[0]);
      //   }
      //   else {
      //                         console.log('Ashish: exitApp');
      //     this.platform.exitApp();
      //   }

      //   return;

      // }, 1);

      //editing back button action

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
