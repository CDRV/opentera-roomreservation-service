import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {startOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {ScheduleService} from '../../services/schedule.service';
import {Reservation} from '../../core/models/reservation.model';
import {Subject} from 'rxjs';
import {ReservationFormDialogComponent} from '../reservation-form-dialog/reservation-form-dialog.component';
import {NotificationService} from '../../services/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {take} from 'rxjs/operators';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() idRoom: number;

  view: CalendarView = CalendarView.Week;
  calendarView = CalendarView;
  viewDate: Date = new Date();

  calendarData: CalendarEvent[] = [];
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen = true;
  refresh: Subject<any> = new Subject();
  private currentDate: Date;


  private static getPreviousMonday(date: Date) {
    const prevSunday = new Date(date);
    prevSunday.setDate(prevSunday.getDate() - prevSunday.getDay());
    return prevSunday;
  }

  private static daysInThisMonth(firstDay: Date | number | string) {
    const date = new Date(firstDay);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  private static getDateString(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate().toString();
    return day + '-' + month + '-' + date.getFullYear();
  }

  private static createCalendarEvent(reservation: Reservation): CalendarEvent {
    return {
      title: reservation.user_name,
      start: new Date(reservation.reservation_start_datetime),
      end: new Date(reservation.reservation_end_datetime),
      color: colors.red,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      meta: reservation.id_reservation
    };
  }

  constructor(private notificationService: NotificationService,
              public dialog: MatDialog,
              private scheduleService: ScheduleService) {
    this.currentDate = CalendarComponent.getPreviousMonday(new Date());
  }

  ngOnInit(): void {
    this.dateChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dateChange();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    console.log('dayClicked', events);
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
    this.dateChange();
  }

  closeOpenMonthViewDay(event: Date) {
    this.currentDate = CalendarComponent.getPreviousMonday(new Date(event));
    this.activeDayIsOpen = false;
    this.dateChange();
  }

  dateChange() {
    if (this.view === 'day') {
      this.getDayData(this.currentDate);
    } else if (this.view === 'week') {
      this.getWeekData(this.currentDate);
    } else if (this.view === 'month') {
      this.getMonthData(this.currentDate);
    }
  }

  private getDayData(firstDay: Date) {
    this.getSchedule(firstDay, firstDay);
  }

  private getWeekData(firstDay: Date) {
    const endDate = new Date(firstDay);
    endDate.setDate(endDate.getDate() + 6);
    this.getSchedule(firstDay, endDate);
  }

  private getMonthData(firstDay: Date) {
    const numberOfDays = CalendarComponent.daysInThisMonth(firstDay);
    const startDate = new Date(firstDay);
    startDate.setDate(1);
    const endDate = new Date(firstDay);
    endDate.setDate(startDate.getDate() + (numberOfDays - 1));

    this.getSchedule(startDate, endDate);
  }

  private getSchedule(startDate: Date, endDate: Date) {
    if (this.idRoom) {
      this.currentDate = startDate;
      const start = CalendarComponent.getDateString(startDate);
      const end = CalendarComponent.getDateString(endDate);
      this.scheduleService.getByRoom(this.idRoom, start, end).subscribe(result => {
        const calendarData = [];
        result.forEach(reservation => {
          calendarData.push(CalendarComponent.createCalendarEvent(reservation));
        });
        this.calendarData = calendarData;
        console.log('calendarData', this.calendarData);
        this.refresh.next();
      });
    }
  }

  openReservationFormDialog(item: any) {
    const copy = {...item};
    const dialogRef = this.dialog.open(ReservationFormDialogComponent, {
      width: '800px',
      data: copy ? copy : new Reservation(),
      disableClose: true
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(reservation => {
      if (reservation) {
        console.log('reservation', reservation);
        this.scheduleService.save(reservation).subscribe(res => {
          console.log(res);
          this.dateChange();
        });
      } else {
        this.dateChange();
      }
    });
  }
}
