import {ReservationService} from '../../services/reservation.service';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {Reservation} from '../../core/models/reservation.model';
import {dateToISOLikeButLocal, setDate} from '../../core/utils/utility-functions';

export class ReservationTimeInputValidator {

  public static checkIfTimeSlotsTaken(reservationService: ReservationService, idRoom: number) {
    if (idRoom) {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const startTime = new Date(control.get('startTime').value);
        const endTime = new Date(control.get('endTime').value);
        const date = new Date(control.get('startDate').value);
        const isoStartDate = dateToISOLikeButLocal(setDate(date, startTime));
        const isoEndDate = dateToISOLikeButLocal(setDate(date, endTime));
        return reservationService.checkOverlaps(idRoom, isoStartDate, isoEndDate)
          .pipe(
            debounceTime(200),
            map((data: Reservation[]) => {
              return data && data.length > 0 ? {timesOverlapping: true} : null;
            })
          );
      };
    } else {
      return null;
    }
  }
}
