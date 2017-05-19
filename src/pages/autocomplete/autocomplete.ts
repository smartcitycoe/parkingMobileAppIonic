
import { Component, NgZone } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
import { } from '@types/googlemaps';

declare var google: any;
declare var $: any;

@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;

  service: any;

  constructor(public viewCtrl: ViewController, private zone: NgZone, public plt: Platform) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

    plt.ready().then(() => {
      this.service = new google.maps.places.AutocompleteService();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'IN' } }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {

        if (predictions != null) {
          console.log('Prediction length = ' + predictions.length);

          predictions.forEach(function (prediction) {
            me.autocompleteItems.push(prediction.description);
          });
        }
        else {
          me.autocompleteItems.push('no results found');

        }
      });
    });
  }

    closeModal() {

    let dismissObj = { userName: 'Ashish Singal' };
    this.viewCtrl.dismiss(dismissObj);
  }

}