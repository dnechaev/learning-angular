import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class Event {
  constructor(
    public id: number,
    public name: string,
    public dateBegin: Date,
    public dateEnd: Date,
    public price: number,
    public ticketsCount: number,
    public ticketsPurchased?: number,
    public ticketsAvailable?: number,
    public purchasesCount?: number,
    public status?: number,
    public myPurchaseId?: number,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class EventAdapter implements Adapter<Event> {

  input(item: any): Event {
    return new Event(
      item.id,
      item.name,
      (item.dateBegin ? new Date(item.dateBegin) : item.dateBegin),
        (item.dateEnd ? new Date(item.dateEnd) : item.dateEnd),
      (item.price ? +item.price : item.price),
      (item.ticketsCount ? +item.ticketsCount : item.ticketsCount),
      (item.ticketsPurchased ? +item.ticketsPurchased : item.ticketsPurchased),
      (item.ticketsAvailable ? +item.ticketsAvailable : item.ticketsAvailable),
      (item.purchasesCount ? +item.purchasesCount : item.purchasesCount),
      (item.status ? +item.status : item.status),
      (item.myPurchaseId ? +item.myPurchaseId : item.myPurchaseId),
    );
  }

  output(item: Event): any {
    return {
      id: item.id,
      name: item.name,
      dateBegin: (item.dateBegin ? item.dateBegin.toISOString() : item.dateBegin),
      dateEnd: (item.dateEnd ? item.dateEnd.toISOString() : item.dateEnd),
      price: item.price,
      ticketsCount: item.ticketsCount
    };
  }

}
