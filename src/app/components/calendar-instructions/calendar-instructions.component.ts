import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ShowCalendarInstructionsService} from '@services/show-calendar-instructions.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-calendar-instructions',
  templateUrl: './calendar-instructions.component.html',
  styleUrls: ['./calendar-instructions.component.scss']
})
export class CalendarInstructionsComponent implements OnInit, OnDestroy {
  calendarPath = environment.img_prefix + 'assets/images/calendar_icon.svg';
  showInstructions = true;
  private subscription: Subscription;

  constructor(private showInstructionsService: ShowCalendarInstructionsService) { }

  ngOnInit(): void {
    this.subscription = this.showInstructionsService.showInstructions().subscribe((res) => {
      this.showInstructions = res;
    });
  }

  close() {
    this.showInstructionsService.setInstructionsView(false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
