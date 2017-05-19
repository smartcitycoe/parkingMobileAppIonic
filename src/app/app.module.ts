import { NgModule, ErrorHandler ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { IonPullupModule } from 'ionic-pullup/dist';
//import { circulartimepicker } from 'angular-circular-timepicker';
import { MultiPickerModule } from 'ion2-datetime-picker';
import { ParkingModalPage } from '../pages/parking-modal/parking-modal';
import { PaymentPage } from '../pages/payment/payment';
import { TicketPage } from '../pages/ticket/ticket';
import { QRCodePage } from '../pages/qr-code/qr-code';
import { FindParkingModalPage } from '../pages/find-parking-modal/find-parking-modal';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    ParkingModalPage,
    PaymentPage,
    TicketPage,
    QRCodePage,
    FindParkingModalPage,
    AutocompletePage
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
        scrollAssist: false, 
        autoFocusAssist: false
    }),
    IonPullupModule,
    MultiPickerModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    ParkingModalPage,
    PaymentPage,
    TicketPage,
    QRCodePage,
    FindParkingModalPage,
    AutocompletePage
  ],
 providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
