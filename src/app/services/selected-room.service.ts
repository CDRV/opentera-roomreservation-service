import {Injectable} from '@angular/core';
import {Room} from '../core/models/room.model';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedRoomService {
  private roomSubject: BehaviorSubject<Room> = new BehaviorSubject<Room>(new Room());

  constructor() {
  }

  public getSelectedRoom(): Observable<Room> {
    return this.roomSubject.asObservable();
  }

  public setSelectedRoom(room: Room) {
    this.roomSubject.next(room);
  }
}
