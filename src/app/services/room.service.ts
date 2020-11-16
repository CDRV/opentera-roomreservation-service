import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {makeApiURL} from '../shared/utils/make-api-url';
import {Room} from '../shared/models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private API_URL = makeApiURL(true);
  private controller = 'rooms';

  constructor(private http: HttpClient) {
  }

  getBySite(idSite: number): Observable<Room[]> {
    return this.http.get<Room[]>(this.API_URL + this.controller + '?id_site=' + idSite);
  }

  delete(idRoom: number): Observable<any> {
    return this.http.delete(this.API_URL + this.controller + '?id=' + idRoom);
  }
}
