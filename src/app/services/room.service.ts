import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {makeApiURL} from '../shared/utils/make-api-url';
import {Room} from '../shared/models/room.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private API_URL = makeApiURL(true);
  private controller = 'rooms';

  private roomsList: Room[] = [];
  private roomsListSubject: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);

  constructor(private http: HttpClient) {
  }

  roomsList$(): Observable<Room[]> {
    return this.roomsListSubject.asObservable();
  }

  getBySite(idSite: number) {
    this.http.get<Room[]>(this.API_URL + this.controller + '?id_site=' + idSite).subscribe(result => {
      this.roomsList = result;
      this.roomsListSubject.next(this.roomsList);
    });
  }

  delete(idRoom: number): Observable<any> {
    return this.http.delete(this.API_URL + this.controller + '?id=' + idRoom).pipe(
      tap(() => {
        this.roomsList = this.roomsList.filter(p => p.id_room !== idRoom);
        this.roomsListSubject.next(this.roomsList);
      })
    );
  }

  save(room: Room): Observable<Room> {
    return this.http.post<Room>(this.API_URL + this.controller, room).pipe(
      tap(result => {
        console.log(result);
        room = result[0];
        this.roomsList = [...this.roomsList, room];
        this.roomsListSubject.next(this.roomsList);
      })
    );
  }
}
