import {Component, ChangeDetectionStrategy, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {isSameDay, isSameMonth} from 'date-fns';
import {CalendarEvent, CalendarView, collapseAnimation} from 'angular-calendar';
import {ReservationService} from '../../services/reservation.service';
import {Reservation} from '../../core/models/reservation.model';
import {Subject} from 'rxjs';
import {ReservationFormDialogComponent} from '../../components/reservation-form-dialog/reservation-form-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {take} from 'rxjs/operators';
import {Site} from '../../core/models/site.model';
import {Room} from '../../core/models/room.model';

const colors: any = {
  normal: {
    primary: '#1a202e',
    secondary: '#f1f5f9',
  },
  session: {
    primary: '#85a96b',
    secondary: '#dae5d3',
  }
};

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [collapseAnimation]
})
export class ScheduleComponent implements OnInit, OnChanges {
  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  calendarData: CalendarEvent[] = [];
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();
  selectedSite: Site;
  selectedRoom: Room;
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
      title: `${reservation.name} (${reservation.user_name})`,
      start: new Date(reservation.reservation_start_datetime),
      end: new Date(reservation.reservation_end_datetime),
      color: reservation.session_uuid ? colors.session : colors.normal,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      meta: {idReservation: reservation.id_reservation}
    };
  }

  constructor(public dialog: MatDialog,
              private reservationService: ReservationService) {
    this.currentDate = ScheduleComponent.getPreviousMonday(new Date());
    this.selectedSite = new Site();
    this.selectedRoom = new Room();
  }

  ngOnInit(): void {
    this.dateChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  selectedSiteChange(selectedSite: Site) {
    this.selectedSite = selectedSite;
  }

  selectedRoomChange(selectedRoom: Room) {
    this.selectedRoom = selectedRoom;
    this.dateChange();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
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
    this.currentDate = ScheduleComponent.getPreviousMonday(new Date(event));
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
    const numberOfDays = ScheduleComponent.daysInThisMonth(firstDay);
    const startDate = new Date(firstDay);
    startDate.setDate(1);
    const endDate = new Date(firstDay);
    endDate.setDate(startDate.getDate() + (numberOfDays - 1));

    this.getSchedule(startDate, endDate);
  }

  private getSchedule(startDate: Date, endDate: Date) {
    if (this.selectedRoom.id_room) {
      const start = ScheduleComponent.getDateString(startDate);
      const end = ScheduleComponent.getDateString(endDate);
      this.reservationService.getByRoom(this.selectedRoom.id_room, start, end).subscribe((result) => {
        const calendarData = [];
        result.forEach(reservation => {
          calendarData.push(ScheduleComponent.createCalendarEvent(reservation));
        });
        this.calendarData = calendarData;
        this.refresh.next();
      });
    }
  }

  openReservationFormDialog(item: any) {
    const copy = {...item};
    const dialogRef = this.dialog.open(ReservationFormDialogComponent, {
      width: '800px',
      data: {event: copy ? copy : new Reservation()},
      disableClose: true
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((reservation) => {
      if (reservation) {
        this.reservationService.save(reservation).subscribe((res) => {
          this.dateChange();
        });
      } else {
        this.dateChange();
      }
    });
  }

  addReservation(date: Date) {
    console.log(date);
    const dialogRef = this.dialog.open(ReservationFormDialogComponent, {
      width: '800px',
      data: {time: date},
      disableClose: true
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((reservation) => {
      if (reservation) {
        this.reservationService.save(reservation).subscribe(() => {
          this.dateChange();
        });
      } else {
        this.dateChange();
      }
    });
  }
}
