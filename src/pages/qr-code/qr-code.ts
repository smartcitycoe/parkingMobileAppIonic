import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

/*
  Generated class for the QRCode page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-qr-code',
  templateUrl: 'qr-code.html'
})
export class QRCodePage {

  userid: any;
  calendarId: any;
  eventid: any;
  qr_string: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http
  ) {

    //this.qr_string = this.userid + '|' + this.calendarId + '|' + this.eventid;
    this.qr_string = navParams.get('qrresponse');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QRCodePage');

    var qrImage = document.getElementById("qrcode") as HTMLImageElement;
    var qrUrl = 'http://qrickit.com/api/qr?d=' + this.qr_string + '&addtext=Parking+QR+Code&txtcolor=000000&fgdcolor=000000&bgdcolor=FFFFFF&logotext=EYParkingAPP&qrsize=400&t=p&e=m';
    console.log('Ashish:' + qrUrl);
    qrImage.src = qrUrl;

    //this.loadQRCode();
  }
  /*
      URL:
  http://35.154.158.4:8080/SmartParking/download
    Method: POST
      Parameter Name: qrCodeString
  Parameter Value:: 
  
  {
  
  "siteToken": "8811cd57-e92e-44af-86a7-dd6bdd09de56", 
  "assignmentToken": "1183b529-a1cb-436d-a838-58ee9d9fa491",   
  "calendarId": "iiokctfh2pv3qe8idp1o14lm2k@group.calendar.google.com",  
  "eventId": "g9kmth3eusia5j61l5nvkbsabc",   
  "email": "kpsingh1981@gmail.com"
  
  }
  	
    Response:  QR Image
  */






  loadQRCode() {

    let body = new FormData();
    body.append('qrCodeString', '{"siteToken": "8811cd57-e92e-44af-86a7-dd6bdd09de56", "assignmentToken": "1183b529-a1cb-436d-a838-58ee9d9fa491",   "calendarId": "iiokctfh2pv3qe8idp1o14lm2k@group.calendar.google.com",   "eventId": "g9kmth3eusia5j61l5nvkbsabc",   "email": "kpsingh1981@gmail.com"}');

    let headers = new Headers({
    });


    let options = new RequestOptions({ headers: headers });

    this.http
      .post('http://35.154.158.4:8080/SmartParking/download', body, options)
      .map(res => res.json())
      .subscribe(
      data => {

        console.log('Ashish:' + data);
        //this.presentAlert3(data.RESPONSE.token);
        var qrImage = document.getElementById("qrcode") as HTMLImageElement;
        // var qrUrl = 'http://qrickit.com/api/qr?d=' + this.qr_string + '&addtext=Parking+QR+Code&txtcolor=000000&fgdcolor=000000&bgdcolor=FFFFFF&logotext=EYParkingAPP&qrsize=400&t=p&e=m';
        // console.log('Ashish:' + qrUrl);
        qrImage.src = data;

      },
      err => {
        //this.presentAlert3("Invalid Username and password");

        console.log("Ashish: ERROR!: ", err);
      }
      );

  }
}
/**
 * 
 * QR CODE info
 * <img src="http://qrickit.com/api/qr?d=http://anyurl&addtext=Hello+World&txtcolor=442EFF&fgdcolor=76103C
&bgdcolor=C0F912&logotext=QRickit&qrsize=150&t=p&e=m">

The above HTML example produces the following image (png file type):


Data: only "d" (highlighted in red) is required. This is the data to be embedded into the QR Code. The rest is optional image effects.

Example: d=http://anyurl (when scanned, mobile users can go to any URL you specify)
Example: d=anytext (when scanned, mobile users can read your text message)
Example: d=TEL:5551231234 (when scanned, mobile users can add your TEL# to their contacts and dial number)
Example: d=MAILTO:me@qrickit.com (when scanned, mobile users can add your EMAIL address to their contacts and send email)
Example: d=SMSTO:5551231234:anytext (when scanned, mobile users can add your SMS# to their contacts and send SMS message)
Example: d=<?php echo urlencode($yourdata);?> (example using PHP to specify "d")
 */
