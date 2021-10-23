import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {makeApiURL} from '@core/utils/make-api-url';
import {Room} from '@shared/models/room.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private API_URL = makeApiURL(true);
  private controller = 'rooms';

  private rooms: Room[] = [];
  private roomsSubject: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);

  constructor(private http: HttpClient) {
  }

  rooms$(): Observable<Room[]> {
    return this.roomsSubject.asObservable();
  }

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_URL + this.controller).pipe(
      tap(result => {
        this.rooms = result;
        this.roomsSubject.next(this.rooms);
      }));
  }

  getBySite(idSite: number): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_URL + this.controller + '?id_site=' + idSite).pipe(
      tap(result => {
        this.rooms = result;
        this.roomsSubject.next(this.rooms);
      }));
  }

  delete(idRoom: number): Observable<any> {
    return this.http.delete(this.API_URL + this.controller + '?id=' + idRoom).pipe(
      tap(() => {
        this.rooms = this.rooms.filter(p => p.id_room !== idRoom);
        this.roomsSubject.next(this.rooms);
      })
    );
  }

  update(room: Room): Observable<any> {
    return this.http.post<Room[]>(this.API_URL + this.controller, {room}).pipe(
      tap((result) => {
        const updatedRoom: Room = result[0];
        if (room.id_room > 0) {
          const index = this.rooms.findIndex(t => t.id_room === room.id_room);
          this.rooms[index] = updatedRoom;
          this.rooms = [...this.rooms];
        } else {
          room.id_room = updatedRoom.id_room;
          this.rooms = [...this.rooms, room];
        }
        this.roomsSubject.next(this.rooms);
      })
    );
  }
}
