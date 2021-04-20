import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ShowScheduleInstructionsService} from '@services/show-schedule-instructions.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-schedule-instructions',
  templateUrl: './schedule-instructions.component.html',
  styleUrls: ['./schedule-instructions.component.scss']
})
export class ScheduleInstructionsComponent implements OnInit, OnDestroy {
  calendarPath = environment.img_prefix + 'assets/images/calendar_icon.svg';
  showInstructions = true;
  private subscription: Subscription;

  constructor(private showInstructionsService: ShowScheduleInstructionsService) { }

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
