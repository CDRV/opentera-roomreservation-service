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
        const startTime = control.get('startTime');
        const endTime = control.get('endTime');
        const date = control.get('startDate');
        const isoStartDate = dateToISOLikeButLocal(setDate(date.value, startTime.value));
        const isoEndDate = dateToISOLikeButLocal(setDate(date.value, endTime.value));
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
