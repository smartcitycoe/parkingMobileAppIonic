import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { QRCodePage } from '../qr-code/qr-code';
import { Paho } from 'ng2-mqtt/mqttws31'

/*
  Generated class for the Ticket page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html'
})
export class TicketPage {

  //ticket variables
  private calendarId: String;
  private eventId: String;
  private email: String;
  private siteToken: String;
  private assignmentToken: String;
  private assetName: String;
  private parkingLotName: String;
  private starttime: String;
  private endtime: String;

  //paho notification params
  p_ip: string;
  p_port: any;
  p_clientId: string;
  private _client: Paho.MQTT.Client;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    //settting ticket variables according to params recieved
    this.calendarId = navParams.get('calendarId');
    this.eventId = navParams.get('eventId').substring(18);
    this.email = navParams.get('email');
    this.siteToken = navParams.get('siteToken');
    this.assignmentToken = navParams.get('assignmentToken');
    this.assetName = navParams.get('assetName').substring(16);
    this.parkingLotName = navParams.get('parkingLotName');
    this.starttime = navParams.get('startTime');
    this.endtime = navParams.get('endTime');


    //settting up paho Client
    this.p_ip = "35.154.110.137";
    this.p_port = 9000;
    let me = this;

    // this._client = new Paho.MQTT.Client("host", 80, "path", "clientId");
    this.p_clientId = this.getClientId();
    this._client = new Paho.MQTT.Client(this.p_ip, this.p_port, this.p_clientId);

    this._client.onConnectionLost = (responseObject: Object) => {
      console.log('Ashish: Connection lost.' + '[' + this.p_ip + ':' + this.p_port + ']');
    };

    this._client.onMessageArrived = (message: Paho.MQTT.Message) => {
      console.log('Ashish: Message arrived.' + '[' + this.p_ip + ':' + this.p_port + ']');
      console.log('Ashish: Messge[' + message.payloadString + ']');

      //getting json object from string
      var jsonObject = JSON.parse(message.payloadString);
      var notification_message = 'Your parking bay is now ' + jsonObject.request.message;
      this.alertfornotification(notification_message);
    };

    this._client.connect({ onSuccess: me.onConnected.bind(this) });
    //finished setup of Paho

  }

  private onConnected(): void {
    console.log('Ashish: Connected to broker.' + '[' + this.p_ip + ':' + this.p_port + ']');

    this._client.subscribe('EYSEP/input/json/100190/1E36/alert', {});
  }

  getClientId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  alertfornotification(messsage_s: string) {

    let alert = this.alertCtrl.create({
      title: 'Bay Status Changed',
      subTitle: messsage_s,
      buttons: ['Ok']
    });

    alert.present();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

  viewcode() {

    var qrdata = '{"siteToken":"' + this.siteToken +
      '","assignmentToken":"' + this.assignmentToken +
      '","calendarId":"' + this.calendarId +
      '","eventId":"' + this.eventId +
      '","email":"' + this.email + '"}'

    this.navCtrl.push(QRCodePage, {
      qrresponse: qrdata
    });

  }


}
