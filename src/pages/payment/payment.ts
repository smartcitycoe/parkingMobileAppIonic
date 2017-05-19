import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TicketPage } from '../ticket/ticket';

/*
  Generated class for the Payment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

doPayment()
{
    console.log('do payment');

       this.navCtrl.push(TicketPage, {
    //   item: item
     });


}
}
