import {Component, ChangeDetectionStrategy, OnInit, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {isSameDay, isSameMonth} from 'date-fns';
import {CalendarEvent, CalendarView, collapseAnimation} from 'angular-calendar';
import {ReservationService} from '@services/reservation.service';
import {Reservation} from '@shared/models/reservation.model';
import {combineLatest, Subject, Subscription} from 'rxjs';
import {Site} from '@shared/models/site.model';
import {Room} from '@shared/models/room.model';
import {Pages} from '@core/utils/pages';
import {Account} from '@shared/models/account.model';
import {AccountService} from '@services/account.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {isObjectEmpty, isUser} from '@core/utils/utility-functions';
import {SelectedSiteService} from '@services/selected-site.service';
import {SelectedRoomService} from '@services/selected-room.service';
import {ThemePalette} from '@angular/material/core';
import {PermissionsService} from '@services/permissions.service';
import {Permission} from '@shared/models/permission.model';

const colors: any = {
  normal: {
    primary: 'var(--primary-color)',
    secondary: 'var(--primary-lighter-color)',
  },
  session: {
    primary: 'var(--accent-color)',
    secondary: 'var(--accent-lighter-color)',
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [collapseAnimation]
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: CalendarView = CalendarView.Month;
  isUser = false;
  account: Account;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  calendarData: CalendarEvent[] = [];
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();
  selectedSite: Site;
  selectedRoom: Room;
  today: Date;
  showAddButton: any;
  color: ThemePalette = 'primary';
  dayStartHour = 7;
  dayEndHour = 21;
  permissions: Permission;
  private currentDate: Date;
  private subscriptions: Subscription[] = [];
  private isSiteAndRoomSet = false;

  private static getPreviousMonday(date: Date): Date {
    const prevSunday = new Date(date);
    prevSunday.setDate(prevSunday.getDate() - prevSunday.getDay());
    return prevSunday;
  }

  private static daysInThisMonth(firstDay: Date | number | string): number {
    const date = new Date(firstDay);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  private static getDateString(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate().toString();
    return day + '-' + month + '-' + date.getFullYear();
  }

  private static createCalendarEvent(reservation: Reservation): CalendarEvent {
    return {
      title: `${reservation.name} (${reservation.user_fullname})`,
      start: new Date(reservation.reservation_start_datetime),
      end: new Date(reservation.reservation_end_datetime),
      color: reservation.session_uuid ? colors.session : colors.normal,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      meta: {reservation}
    };
  }

  constructor(private reservationService: ReservationService,
              private accountService: AccountService,
              private permissionsService: PermissionsService,
              private selectedSiteService: SelectedSiteService,
              private selectedRoomService: SelectedRoomService,
              private router: Router,
              public dialog: MatDialog) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.getAccount();
    this.getSelectedSiteAndRoom();
    this.getEvents();
  }

  private getAccount(): void {
    const account$ = this.accountService.account$();
    const permissions$ = this.permissionsService.permissions$();
    this.subscriptions.push(
      combineLatest([account$, permissions$]).subscribe(([account, permissions]) => {
        this.permissions = permissions;
        this.isUser = isUser(account);
        if (!this.isUser) {
          this.view = CalendarView.Week;
        }
        this.account = account;
      })
    );
  }

  private getSelectedSiteAndRoom(): void {
    const site$ = this.selectedSiteService.getSelectedSite();
    const room$ = this.selectedRoomService.getSelectedRoom();
    this.subscriptions.push(
      combineLatest([site$, room$]).subscribe(([site, room]) => {
        this.selectedSite = site;
        this.selectedRoom = room;
        this.isSiteAndRoomSet = !isObjectEmpty(site) && !isObjectEmpty(room)
        if (this.isSiteAndRoomSet) {
          this.dateChange();
        }
      })
    );
  }

  private getEvents(): void {
    const events$ = this.reservationService.reservations$();
    this.subscriptions.push(
      events$.subscribe((reservations) => {
        this.transformEventsForCalendar(reservations);
      })
    );
  }

  private transformEventsForCalendar(reservationsFromAPI: Reservation[]): void {
    const calendarData: CalendarEvent[] = [];
    reservationsFromAPI.forEach((reservation) => {
      calendarData.push(CalendarComponent.createCalendarEvent(reservation));
    });
    this.calendarData = calendarData;
    this.refresh.next();
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0);
      this.viewDate = date;
    }
  }

  viewDateChange(date: Date): void {
    this.activeDayIsOpen = false;
    switch (this.view) {
      case CalendarView.Day:
        this.currentDate = date;
        break;
      case CalendarView.Week:
        this.currentDate = CalendarComponent.getPreviousMonday(new Date(date));
        break;
      case CalendarView.Month:
        this.currentDate = new Date(date);
        break;
      default:
        break;
    }
    this.dateChange();
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.dateChange();
  }

  dateChange(): void {
    switch (this.view) {
      case CalendarView.Day:
        this.getDayData(this.currentDate);
        break;
      case CalendarView.Week:
        this.getWeekData(this.currentDate);
        break;
      case CalendarView.Month:
        this.getMonthData(this.currentDate);
        break;
      default:
        break;
    }
  }

  private getDayData(firstDay: Date): void {
    this.refreshCalendar(firstDay, firstDay);
  }

  private getWeekData(firstDay: Date): void {
    const endDate = new Date(firstDay);
    endDate.setDate(endDate.getDate() + 6);
    this.refreshCalendar(firstDay, endDate);
  }

  private getMonthData(firstDay: Date): void {
    const numberOfDays = CalendarComponent.daysInThisMonth(firstDay);
    const startDate = new Date(firstDay);
    startDate.setDate(1);
    const endDate = new Date(firstDay);
    endDate.setDate(startDate.getDate() + (numberOfDays - 1));

    this.refreshCalendar(startDate, endDate);
  }

  private refreshCalendar(startDate: Date, endDate: Date): void {
    if (this.isSiteAndRoomSet) {
      const start = CalendarComponent.getDateString(startDate);
      const end = CalendarComponent.getDateString(endDate);
      this.reservationService.getByRoom(this.selectedRoom.id_room, start, end).subscribe();
    }
  }

  openForm(event: CalendarEvent): void {
    if (this.isUser
      && (this.permissions.site_admin // Either is site admin OR the connected user made the reservation
        || (!this.permissions.site_admin && event.meta.reservation.user_uuid === this.account.login_uuid))) {
      const idReservation = event.meta.reservation.id_reservation;
      this.router.navigate([Pages.reservationFormPage, {idReservation}]);
    }
  }

  openFormWithTime(date: Date): void {
    if (this.isUser) {
      const time = date.toISOString();
      this.router.navigate([Pages.reservationFormPage, {time}]);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
