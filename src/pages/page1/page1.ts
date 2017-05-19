import { Component } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation, PositionError, Geoposition, Keyboard } from 'ionic-native';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import L from "leaflet";

//pull up
import { IonPullUpFooterState } from 'ionic-pullup/dist';
import { ParkingModalPage } from '../parking-modal/parking-modal';
import { FindParkingModalPage } from '../find-parking-modal/find-parking-modal';
import { ParkingListModel } from '../../app/models/ParkingList-model';

const OPT_GEOLOCATION = { maximumAge: 12000, timeout: 5000, enableHighAccuracy: false };

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'

})
export class Page1 {

  map: any;
  center: { lat: number, lng: number };
  currentLocation: { lat: number, lng: number };

  marker: L.Marker;
  following = false;
  subscription: any;
  footerState: IonPullUpFooterState;

  LeafIcon: any;
  greenIcon: any;
  redIcon: any;
  userIcon: any;

  datamodel: any;

  userName: string;
  bookstarttime: string;
  bookendtime: string;

  //*****************************************Constructor & Init METHODS************************************** */
  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController) {

    console.log('In Constructor');
    this.footerState = IonPullUpFooterState.Collapsed;

    Keyboard.disableScroll(true);

  }
  ngOnInit() {
    console.log('ng on init');
  }
  //*****************************************IONIC LIFE CYCLE METHODS************************************** */
  ionViewLoaded() {

  }
  ionViewDidLoad() {
    console.log('In ion view did load');
    this.initMap();
  }

  ionViewWillEnter() {
    console.log('In ion view will enter');
  }

  ionViewWillUnload() {
    console.log('In ion view will unload');

  }
  ionViewWillLeave() {
    console.log('In ion view will leave');
  }

  ionViewCanLeave() {
    console.log('ionViewCanLeave()');
    document.getElementById("map").outerHTML = "";
  }
  //*****************************************Footer Methods************************************** */
  footerExpanded() {
    console.log('Footer expanded!');
  }
  footerCollapsed() {
    console.log('Footer collapsed!');
  }
  toggleFooter() {
    // this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
    this.FindParkingAction();
  }
  //*****************************************Map Methods************************************** */

  initMap() {

    console.log('Ashish: initmap()');

    this.LeafIcon = L.Icon.extend({
      options: {
        customId: "",
        shadowUrl: 'assets/images/marker-shadow.png',
        iconSize: [25, 41], // size of the icon
        shadowSize: [41, 41], // size of the shadow
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        shadowAnchor: [12, 41],  // the same for the shadow
        popupAnchor: [1, -34] // point from which the popup should open relative to the iconAnchor
      }
    });

    this.greenIcon = new this.LeafIcon({ iconUrl: 'assets/images/green-icon.png' }),
      this.redIcon = new this.LeafIcon({ iconUrl: 'assets/images/red-icon.png' }),
      this.userIcon = new this.LeafIcon({ iconUrl: 'assets/images/user-icon.png' });

    var grayscale = L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", { id: 'MapID', attribution: 'openstreetmap' }),
      Colored = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { id: 'MapID', attribution: 'openstreetmap' });

    var baseMaps = {
      "Grayscale": grayscale,
      "Coloured": Colored
    };

    // this.currentLocation = { lat: 28.6480, lng: 77.2130 };
    //this.currentLocation = { lat: 28.7097467, lng: 77.0841197};

    //set current location
    let me = this;
    Geolocation.getCurrentPosition().then((position) => {
      
      me.currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
    console.log('Ashish: lat: ' + me.currentLocation.lat + ' long: ' + me.currentLocation.lng);

      me.map = L.map('map', {
        center: me.currentLocation,
        zoom: 13,
        layers: [grayscale, Colored]
      });

    L.control.layers(baseMaps).addTo(me.map);
    L.marker(me.currentLocation, { icon: me.userIcon }).addTo(me.map).bindPopup('Current Location');


    }, (err) => {
      console.log('Ashish:' + err);
      this.presentAlert3('Check Your GPS connectivity');
    });
    //set current location
  }


  updateMarker(latlng: { lat: number, lng: number }) {
    if (this.marker) {
      this.marker = this.marker.setLatLng(latlng).bindPopup('This is your Searched location.');
    } else {
      this.marker = L.marker(latlng).addTo(this.map).bindPopup('This is your Searched location.');
    }
  }


  toggleFollow() {
    //follow disabled: start follow
    if (!this.following) {
      if (!Geolocation || !Geolocation.watchPosition) {
        this.errorToast({ code: 901, message: "no Geolocation available" });
      }
      this.subscription = Geolocation.watchPosition(OPT_GEOLOCATION).subscribe(data => {
        //case: data = PositionError
        if ((data as Geoposition).coords === undefined) {
          //var positionError = (data as Geoposition);
          //this.errorToast(Geoposition);

          //case: data = Geoposition
        } else {
          var geoposition = (data as Geoposition);
          this.onGeolocationUpdate(geoposition);
        }
      })
      //follow not disabled: stop follow
    } else {
      this.subscription.unsubscribe();
    }
  }

  onGeolocationUpdate(position: Geoposition) {
    let latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
    this.center = latlng;
    this.updateMarker(latlng);
  }

  errorToast(error: PositionError) {
    console.log('Error ' + error.message);
    let toast = this.toastCtrl.create({
      message: 'Error: ' + error.message,
      showCloseButton: true
    });
    toast.present();
  }
  //*****************************************CLICK METHODS************************************** */
  onMarkerClicked() {
    console.log('onMarkerClicked');
    //this.openModal();
  }
  onMarkerClicked2(e: any) {
    console.log('onMarkerClicked' + e.latlng);

    var object = this.getParkingObject(e.latlng.lat);
    //console.log('searched object' + object.name);

    this.openModal(object);

  }


  getParkingObject(lat) {

    var pObject;

    for (var i = 0; i < this.datamodel.items.length; i++) {
      var dataItem = this.datamodel.items[i];
      console.log('From Response:' + dataItem.map.metadata.centerLatitude);
      console.log('From Click' + lat);


      if (dataItem.map.metadata.centerLatitude === lat) {
        console.log('Object Found');
        pObject = dataItem;
        console.log(pObject.description);
        break;

      }
      else
        console.log('Object not Found');

    }

    return pObject;

  }

  //*****************************************Support METHODS************************************** */
  openModal(pObject: any) {

    console.log('before model open: ' + pObject.name);

    let obj = {
      userId: '1',

      parkingname: pObject.name,
      parkingaddress: pObject.description,
      imageurl: pObject.imageUrl,
      availablespot: String(pObject.metadata.availableSpotNumber),
      totalspot: String(pObject.metadata.totalSpotNumber),
      normalRate: String(pObject.metadata.normalRatePerCycle),
      maxduration: String(pObject.metadata.maximumParkingDuration),
      overstay: String(pObject.metadata.ovrestayRatePerCycle),

      bookstarttime: this.bookstarttime,
      bookendtime: this.bookendtime,
      parkingToken: pObject.token,
      email: 'ey.smartcity.coe@gmail.com'
    };

    let myModal = this.modalCtrl.create(ParkingModalPage, obj);

    myModal.onDidDismiss(data => {

      this.userName = data.place;
      console.log(this.userName);
    });

    myModal.present();
  }

  getParkingLotList(dataObejct: any) {

    let loader = this.loading.create({
      content: 'Getting Nearest Parkings...',
    });

    // var pLatitude = 28.630008;
    // var pLongitude = 77.213422;

    var pLatitude = dataObejct.lat;
    var pLongitude = dataObejct.long;


    var startTime = dataObejct.mstarttime;//'2017-03-18+13:00:00';
    var endTime = dataObejct.mendtime;//'2017-03-18+14:00:00';
    var radius = 4;

    this.bookstarttime = dataObejct.mstarttime;
    this.bookendtime = dataObejct.mendtime;

    let headers = new Headers({
    });
    headers.append('Authorization','Basic cm9vdDpwYXNzd29yZA==');
    let options = new RequestOptions({ headers: headers });

    var url = 'http://35.154.184.211:8080/SmartParking/searchParkingLots?'
      + 'latitude=' + pLatitude
      + '&longitude=' + pLongitude
      + '&startTime=' + startTime
      + '&endTime=' + endTime
      + '&radius=' + radius

    console.log('Ashish: Url for getparkinglot:' + url);

    loader.present().then(() => {

      this.http
        .get(url,options)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log('Ashish: Response from FIRST API');
          console.log('Ashish:' + data);
          loader.dismiss();

          this.datamodel = new ParkingListModel('parking_list', data.results);
          console.log("Ashish: DataModels from Responses", this.datamodel);

          this.updateUIwithParkingLots(this.datamodel, pLatitude, pLongitude);
        },
        err => {
          this.presentAlert3("Invalid response");
          console.log("ERROR!: ", err);
          loader.dismiss();
        }
        );
    });
  }


  updateUIwithParkingLots(ParkingModels: ParkingListModel, centerlat: any, centerlong: any) {
    // this.center = { lat: 28.6331, lng: 77.2197 };
    this.center = { lat: centerlat, lng: centerlong };

    this.updateMarker(this.center);

    this.map.setView(this.center, 13);
    this.map.setZoom(13);

    this.map.on('click', function (e) {
      console.log(e.latlng);
    });

    L.circle(this.center, 3000, { color: '#5BA9E9', opacity: 0.2 }).addTo(this.map);

    if (ParkingModels.items.length != 0) {
      for (var i = 0; i < ParkingModels.items.length; i++) {
        var dataItem = ParkingModels.items[i];

        if (dataItem.metadata.availableSpotNumber == 0)
          L.marker([dataItem.map.metadata.centerLatitude, dataItem.map.metadata.centerLongitude], { icon: this.redIcon }).addTo(this.map).on('click', (e) => { this.onMarkerClicked2(e) });
        else
          L.marker([dataItem.map.metadata.centerLatitude, dataItem.map.metadata.centerLongitude], { icon: this.greenIcon }).addTo(this.map).on('click', (e) => { this.onMarkerClicked2(e) });

      }
    }
    else {
      this.presentAlert3('No slots available in area');
    }
  }

  presentAlert3(messsage_s: string) {
    let alert = this.alertCtrl.create({
      title: 'Response',
      subTitle: messsage_s,
      buttons: ['Ok']
    });
    alert.present();
  }


  FindParkingAction() {

    let obj = {
      userId: '1',
    };

    let findModal = this.modalCtrl.create(FindParkingModalPage, obj);
    findModal.present();

    findModal.onDidDismiss(data => {

      console.log('Modal dismissed' + data.place + '&' + data.starttime + '&' + data.endtime);
      let dataObj = {
        lat: data.lat,
        long: data.long,
        mstarttime: data.starttime,
        mendtime: data.endtime
      };

      this.getParkingLotList(dataObj);
    });
  }

}



