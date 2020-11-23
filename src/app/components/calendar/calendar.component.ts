import {Component, ChangeDetectionStrategy, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {ScheduleService} from '../../services/schedule.service';
import {Reservation} from '../../core/models/reservation.model';
import {Subject} from 'rxjs';
import {ReservationFormDialogComponent} from '../reservation-form-dialog/reservation-form-dialog.component';
import {NotificationService} from '../../services/notification.service';
import {MatDialog} from '@angular/material/dialog';

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
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;
  @Input() idRoom: number;

  view: CalendarView = CalendarView.Week;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };

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

  constructor(private modal: NgbModal,
              private notificationService: NotificationService,
              public dialog: MatDialog,
              private scheduleService: ScheduleService) {
    this.currentDate = CalendarComponent.getPreviousMonday(new Date());
  }

  private static createCalendarEvent(reservation: Reservation): CalendarEvent {
    const endDate = new Date(reservation.reservation_start_datetime);
    const hours = Math.floor(reservation.reservation_duration);
    const minutes = reservation.reservation_duration % 1;
    endDate.setHours(endDate.getHours() + hours);
    endDate.setMinutes(endDate.getMinutes() + minutes);

    return {
      title: reservation.user_name,
      start: new Date(reservation.reservation_start_datetime),
      end: endDate,
      color: colors.red,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      }
    };
  }

  ngOnInit(): void {
    this.dateChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dateChange();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    console.log(date, events);
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
      this.viewDate = date;
    }
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
    this.dateChange();
  }

  closeOpenMonthViewDay(event: Date) {
    console.log('closeOpenMonthViewDay', event);
    this.currentDate = CalendarComponent.getPreviousMonday(new Date(event));
    this.activeDayIsOpen = false;
    this.dateChange();
  }

  dateChange() {
    console.log(this.currentDate);
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
    console.log('getScehdue', this.idRoom, startDate, endDate);
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
      width: '500px',
      data: copy ? copy : new Reservation()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        if (!result.id_room) {
          result.id_room = 0;
        }
      }
    });
  }
}
