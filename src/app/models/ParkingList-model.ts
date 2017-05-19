import {Observable} from 'rxjs/Observable';

export class ParkingListModel {

  parkinglist: any;
  parkinglistObserver: any;

  constructor(public title: string, public items: any[]){

    this.items = items;

    this.parkinglist = Observable.create(observer => {
      this.parkinglistObserver = observer;
    });

  }

  addItem(item): void {

    this.items.push({
      title: item,
      checked: false
    });

    this.parkinglistObserver.next(true);

  }

  removeItem(item): void {

    let index = this.items.indexOf(item);

    if(index > -1){
      this.items.splice(index, 1);
    }    

    this.parkinglistObserver.next(true);

  }

  renameItem(item, title): void {

    let index = this.items.indexOf(item);

    if(index > -1){
      this.items[index].title = title;
    }

    this.parkinglistObserver.next(true);

  }

  setTitle(title): void {
    this.title = title;
    this.parkinglistObserver.next(true);
  }

  toggleItem(item): void {
    item.checked = !item.checked; 
    this.parkinglistObserver.next(true);
  }

}