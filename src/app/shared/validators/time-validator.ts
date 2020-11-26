import {FormGroup} from '@angular/forms';

// Validate that the start of the reservation is before its end.
export function TimeValidator(
  endTimeControlName: string,
  startTimeControlName: string
) {
  return (formGroup: FormGroup) => {
    const endTime = formGroup.controls[endTimeControlName];
    const startTime = formGroup.controls[startTimeControlName];

    if (!endTime.value || endTime.value.length === 0 || !startTime.value || startTime.value.length === 0) {
      return;
    }

    const end = new Date(endTime.value);
    const start = new Date(startTime.value);

    if (start.getHours() > end.getHours()) {
      startTime.setErrors({startTimeAfterEndTime: true});
      endTime.setErrors({startTimeAfterEndTime: true});
    } else if (start.getHours() === end.getHours() && start.getMinutes() >= end.getMinutes()) {
      startTime.setErrors({startTimeAfterEndTime: true});
      endTime.setErrors({startTimeAfterEndTime: true});
    } else {
      endTime.setErrors(null);
    }
  };
}
