import {Injectable} from '@angular/core';
import {makeApiURL} from '../shared/utils/make-api-url';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reservation} from '../shared/models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private API_URL = makeApiURL(true);
  private controller = 'reservations';

  constructor(private http: HttpClient) {
  }

  getByRoom(idRoom: number, start: string, end: string): Observable<Reservation[]> {
    const dates = '&start_date=' + start + '&end_date=' + end;
    return this.http.get<Reservation[]>(this.API_URL + this.controller + '?id_room=' + idRoom + dates);
  }
}
