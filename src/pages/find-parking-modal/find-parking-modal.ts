import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AutocompletePage } from '../autocomplete/autocomplete';
/*
  Generated class for the FindParkingModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-find-parking-modal',
  templateUrl: 'find-parking-modal.html'
})
export class FindParkingModalPage {

  //today: any;
  starttime: String;
  endtime: String;
  place: any;
  lat:any;
  long:any;

  address;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private modalCtrl: ModalController) {

    this.starttime = new Date().toISOString();
    this.endtime = new Date().toISOString();
    this.place = "";
    this.lat = 0;
    this.long = 0;

    this.address = {
      place: ''
    };
  }

  searchParkingLots() {

    console.log('Place: ' + this.place);
    console.log('Start Date & Time: ' + this.starttime);
    console.log('End Date & Time: ' + this.endtime);

    this.starttime = this.toCustomDateString(this.starttime);
    this.endtime = this.toCustomDateString(this.endtime);

    let dismissObj = {
      place: this.place,
      starttime: this.starttime,
      endtime: this.endtime,
      lat:this.lat,
      long:this.long
    };

    console.log('Ashish:' + dismissObj.lat, dismissObj.long);

    this.viewCtrl.dismiss(dismissObj);
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(AutocompletePage);
    // let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
      this.place =data;

      //reverse geocode

    var service = new google.maps.places.AutocompleteService();
    var request = { input: this.place };
    var geocoder = new google.maps.Geocoder();
    let me = this;
    service.getPlacePredictions(request, function (predictions, status) {
      geocoder.geocode({
        'placeId': predictions[0].place_id
      },
        function (responses, status) {
          var plat = responses[0].geometry.location.lat();
          var plng = responses[0].geometry.location.lng();
          console.log(plat, plng);
          me.lat = plat;
          me.long = plng;
        });
    });
    //reverse geocode

    });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindParkingModalPage');
  }

  private toCustomDateString(date: String) {

    var x = date;
    x = date.substring(0, 10) + '+' + x.substring(11);
    var b = x;
    b = b.substring(0, b.length - 5);
    console.log('EDITED START TIME: ' + b);
    return b;
  }

  closeModal() {

    let dismissObj = { userName: 'Ashish Singal' };
    this.viewCtrl.dismiss(dismissObj);
  }
}
