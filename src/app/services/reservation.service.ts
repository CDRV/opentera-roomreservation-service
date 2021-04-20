import {Injectable} from '@angular/core';
import {makeApiURL} from '@core/utils/make-api-url';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reservation} from '@models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private API_URL = makeApiURL(true);
  private controller = 'reservations';

  constructor(private http: HttpClient) {
  }

  getByRoom(idRoom: number, start: string, end: string): Observable<Reservation[]> {
    const dates = '&start_date=' + start + '&end_date=' + end;
    return this.http.get<Reservation[]>(this.API_URL + this.controller + '?id_room=' + idRoom + dates);
  }

  getById(idReservation: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.API_URL + this.controller + '?id_reservation=' + idReservation);
  }

  delete(idReservation: number): Observable<any> {
    return this.http.delete(this.API_URL + this.controller + '?id=' + idReservation);
  }

  save(reservation: Reservation): Observable<any> {
    return this.http.post(this.API_URL + this.controller, {reservation});
  }

  checkOverlaps(idRoom: number, start: string, end: string) {
    const args = '?id_room=' + idRoom + '&overlaps=true' + '&start_date=' + start + '&end_date=' + end;
    return this.http.get<Reservation[]>(this.API_URL + this.controller + args);
  }
}
