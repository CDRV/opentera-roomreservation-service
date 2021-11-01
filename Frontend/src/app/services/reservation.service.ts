import {Injectable} from '@angular/core';
import {makeApiURL} from '@core/utils/make-api-url';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Reservation} from '@shared/models/reservation.model';
import {shareReplay, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private API_URL = makeApiURL(true);
  private controller = 'reservations';
  private reservations: Reservation[] = [];
  private reservationsSubject: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);

  constructor(private http: HttpClient) {
  }

  reservations$(): Observable<Reservation[]> {
    return this.reservationsSubject.asObservable().pipe(shareReplay(1));
  }

  getByRoom(idRoom: number, start: string, end: string): Observable<Reservation[]> {
    const dates = '&start_date=' + start + '&end_date=' + end;
    return this.http.get<Reservation[]>(this.API_URL + this.controller + '?full=true&id_room=' + idRoom + dates).pipe(
      tap((events) => {
        this.reservations = events;
        this.reservationsSubject.next(events);
      })
    );
  }

  getById(idReservation: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.API_URL + this.controller + '?full=true&id_reservation=' + idReservation);
  }

  delete(idReservation: number): Observable<any> {
    return this.http.delete(this.API_URL + this.controller + '?id=' + idReservation).pipe(
      tap(() => {
        this.reservations = this.reservations.filter(t => t.id_reservation !== idReservation);
        this.reservationsSubject.next(this.reservations);
      })
    );
  }

  update(reservation: Reservation): Observable<Reservation[]> {
    return this.http.post<Reservation[]>(this.API_URL + this.controller, {reservation}).pipe(
      tap((result) => {
        const updatedReservation: Reservation = result[0];
        reservation.id_reservation = updatedReservation.id_reservation;
        if (reservation.id_reservation > 0) {
          const index = this.reservations.findIndex(t => t.id_reservation === reservation.id_reservation);
          this.reservations[index] = reservation;
          this.reservations = [...this.reservations];
        } else {
          this.reservations = [...this.reservations, reservation];
        }
        this.reservationsSubject.next(this.reservations);
      })
    );
  }

  checkOverlaps(start: string, end: string, idRoom: number, userUUID: string = ''): Observable<Reservation[]> {
    let args = `?id_room=${idRoom}&overlaps=true&start_date=${start}&end_date=${end}`;
    if (userUUID.length > 0) {
      args += `&user_uuid=${userUUID}`;
    }
    return this.http.get<Reservation[]>(this.API_URL + this.controller + args);
  }
}
