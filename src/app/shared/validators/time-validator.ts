import {AbstractControl} from '@angular/forms';

// Validate that the start of the reservation is before its end.
export class TimeInputValidator {

  public static validateTimes(control: AbstractControl) {
    const startTime = control.get('startTime');
    const endTime = control.get('endTime');
    const start = new Date(startTime.value);
    const end = new Date(endTime.value);

    if (start.getHours() > end.getHours()) {
      startTime.setErrors({startTimeAfterEndTime: true});
      endTime.setErrors({startTimeAfterEndTime: true});
    } else if (start.getHours() === end.getHours() && start.getMinutes() >= end.getMinutes()) {
      startTime.setErrors({startTimeAfterEndTime: true});
      endTime.setErrors({startTimeAfterEndTime: true});
    } else {
      endTime.setErrors(null);
      startTime.setErrors(null);
    }
    return null;
  }
}
