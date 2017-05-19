import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

//import { PaymentPage } from '../payment/payment';
import { TicketPage } from '../ticket/ticket';

/*
  Generated class for the ParkingModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-parking-modal',
  templateUrl: 'parking-modal.html'
})
export class ParkingModalPage {

  private capacity: String;
  private availability: String;
  private minimum: String;
  private maxduration: String;
  private overstay: String;
  private pName: String;
  private address: String;

  private isenabled: boolean = false;


  private bookstarttime: String;
  private bookendtime: String;
  private parkingToken: String;
  private email: String;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController) {

    this.pName = this.navParams.get('parkingname');
    this.address = this.navParams.get('parkingaddress');
    this.availability = this.navParams.get('availablespot');
    this.capacity = this.navParams.get('totalspot');
    this.minimum = 'Rs. ' + this.navParams.get('normalRate');
    this.maxduration = this.navParams.get('maxduration') + ' Hours';
    this.overstay = 'Rs. ' + this.navParams.get('overstay');

    //For booking api
    this.bookstarttime = this.navParams.get('bookstarttime');
    this.bookendtime = this.navParams.get('bookendtime');
    this.parkingToken = this.navParams.get('parkingToken');
    this.email = this.navParams.get('email');

    if (this.availability == '0') {
      //enable the button
      this.isenabled = false;
    } else {
      //disable the button
      this.isenabled = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkingModalPage');

    var parkimage = document.getElementById("photo") as HTMLImageElement;
    console.log(this.navParams.get('imageurl'));
    parkimage.src = this.navParams.get('imageurl');
  }

  closeModal() {

    let dismissObj = { userName: 'Ashish Singal' };
    this.viewCtrl.dismiss(dismissObj);
  }




  ////integrating booking Api
  /**
   * 
   * 2.	Booking of Parking Bay(Based on the Google Calendar API) 
o	URL:
http://35.154.158.4:8080/SmartParking/bookParkingBay?parkingLotToken=8811cd57-e92e-44af-86a7-dd6bdd09de56&email=kpsingh1981@gmail.com&startTime=2017-03-18+01:00:00&duration=2&radius=4&durationUnit=10
o	Response
{
  "calendarId": "01e0rvtm8msr371fa6d937rv68@group.calendar.google.com",
  "eventId": "2qi2hcar5mo8vjepsc1cjcrap4",
  "email": "kpsingh1981@gmail.com",
  "siteToken": "8811cd57-e92e-44af-86a7-dd6bdd09de56",
  "assignmentToken": "1183b529-a1cb-436d-a838-58ee9d9fa491",
  "assetName": "DLFPointParking.Slot4",
  "parkingLotName": "DLF Capitol Point Parking Lot"
}
   */
  doBooking() {

    let loader = this.loading.create({
      content: 'Booking the parking...',
    });

    var parkingLotToken = this.parkingToken;//'8811cd57-e92e-44af-86a7-dd6bdd09de56';
    var email = this.email;//'kpsingh1981@gmail.com';
    var startTime = this.bookstarttime;//'2017-03-18+13:00:00';
    var endTime = this.bookendtime;//'2017-03-18+14:00:00';

    var url = 'http://35.154.184.211:8080/SmartParking/bookParkingBay?'
      + 'parkingLotToken=' + parkingLotToken
      + '&email=' + email
      + '&startTime=' + startTime
      + '&endTime=' + endTime;

    console.log('ashish: Booking URl: ' + url);

    loader.present().then(() => {

      this.http
        .get(url)
        .map(res => res.json())
        .subscribe(
        data => {

          console.log('Ashish:' + data);
          loader.dismiss();
          console.log("Ashish: DataModels from Responses: " + data.calendarId);
          //this.presentAlert(data.calendarId);

          this.navCtrl.push(TicketPage, {
               calendarId: data.calendarId,
               eventId:data.eventId,
               email:data.email,
               siteToken:data.siteToken,
               assignmentToken:data.assignmentToken,
               assetName:data.assetName,
               parkingLotName:data.parkingLotName,

               startTime: this.bookstarttime,
               endTime:this.bookendtime
          });

        },
        err => {
          this.presentAlert("Invalid response");

          console.log("ERROR!: ", err);
          loader.dismiss();

        }
        );
    });
  }

  presentAlert(messsage_s: string) {
    let alert = this.alertCtrl.create({
      title: 'Response',
      subTitle: messsage_s,
      buttons: ['Ok']
    });
    alert.present();
  }
}
