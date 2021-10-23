import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowCalendarInstructionsService {
  private showScheduleInstructions: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
  }

  showInstructions(): Observable<boolean> {
    return this.showScheduleInstructions.asObservable();
  }

  setInstructionsView(show: boolean) {
    this.showScheduleInstructions.next(show);
  }
}
