import {AbstractControl, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {dateToISOLikeButLocal} from '@core/utils/utility-functions';
import {ReservationService} from '@services/reservation.service';
import {Reservation} from '@shared/models/reservation.model';
import {AccountService} from '@services/account.service';

export class TimeInputValidator {

  constructor() {
  }

  public static validateTimes(control: AbstractControl): null {
    const startControl = control.get('startTime');
    const endControl = control.get('endTime');

    if (!startControl || !endControl) {
      return null;
    }

    const startTime = new Date(startControl.value);
    const endTime = new Date(endControl.value);

    if (startTime >= endTime) {
      startControl.setErrors({startTimeAfterEndTime: true});
      endControl.setErrors({startTimeAfterEndTime: true});
    } else {
      startControl.setErrors(null);
      endControl.setErrors(null);
    }
    return null;
  }

  public static checkIfTimeSlotsTaken(reservationService: ReservationService, reservationId: number): any {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const startControl = control.get('startTime');
      const endControl = control.get('endTime');
      const roomControl = control.get('room');
      const userControl = control.get('user');

      if (!startControl || !endControl || !roomControl || !roomControl.value.id_room) {
        return of(null);
      }

      const startTime = new Date(startControl.value);
      const endTime = new Date(endControl.value);
      const isoStartDate = dateToISOLikeButLocal(startTime);
      const isoEndDate = dateToISOLikeButLocal(endTime);
      const user = userControl.value;

      return reservationService.checkOverlaps(isoStartDate, isoEndDate, roomControl.value.id_room)
        .pipe(
          debounceTime(200),
          map((data: Reservation[]) => {
            data = data.filter(x => {
              return x.id_reservation !== reservationId;
            });
            return data && data.length > 0 ? {timesOverlapping: true} : null;
          })
        );
    };
  }
}
