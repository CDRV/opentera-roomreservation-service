import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Session} from '@shared/models/session.model';
import {Participant} from '@shared/models/participant.model';
import {combineLatest, EMPTY, Subscription} from 'rxjs';
import {Account} from '@shared/models/account.model';
import {GlobalConstants} from '@core/utils/global-constants';
import {Reservation} from '@shared/models/reservation.model';
import {ReservationService} from '@services/reservation.service';
import {NotificationService} from '@services/notification.service';
import {AccountService} from '@services/account.service';
import {MatDialog} from '@angular/material/dialog';
import {switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages} from '@core/utils/pages';
import {TimeInputValidator} from '@core/validators/time-validator';
import {validateAllFields} from '@core/utils/validate-form';
import {
  dateToISOLikeButLocal,
  getDuration,
  isObjectEmpty,
  isUser,
  roundToNearestQuarter
} from '@core/utils/utility-functions';
import {ConfirmationDialogComponent} from '@components/confirmation-dialog/confirmation-dialog.component';
import {PermissionsService} from '@services/permissions.service';
import {Permission} from '@shared/models/permission.model';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit, OnDestroy {
  idReservation: number;
  reservation: Reservation;
  title: string;
  canSave = false;
  session: Session;
  hasSession = false;
  reservationForm: FormGroup;
  sessionParticipants: Participant[] = [];
  required = GlobalConstants.requiredMessage;
  startTimeControlName = 'startTime';
  endTimeControlName = 'endTime';
  startTime: Date;
  endTime: Date;
  today = new Date();
  selectedUserUUID = '';
  idReservationProject: number;
  permissions: Permission;
  canDelete = false;
  private account: Account;
  private subscriptions: Subscription[] = [];

  constructor(private reservationService: ReservationService,
              private notificationService: NotificationService,
              private accountService: AccountService,
              private permissionsService: PermissionsService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.startTime = roundToNearestQuarter(this.today);
    this.endTime = roundToNearestQuarter(this.today);
    this.endTime.setHours(this.endTime.getHours() + 1);
    this.initializeForm();
    this.checkFormChange();
    this.getData();
    this.title = 'Nouvelle réservation';
    this.canSave = false;
  }

  private getData(): void {
    const account$ = this.accountService.account$();
    const routeParam$ = this.route.params;
    const permissions$ = this.permissionsService.permissions$();

    combineLatest([account$, routeParam$, permissions$]).pipe(
      tap(([account, params, permissions]) => {
        if (params.time) {
          const date = new Date(params.time);
          this.setNewTime(date);
        }
      }),
      switchMap(([account, params, permissions]) => {
        this.permissions = permissions;
        this.account = account;
        if (params.idReservation) {
          return this.reservationService.getById(params.idReservation);
        } else {
          this.reservation = new Reservation();
          this.reservation.id_reservation = 0;
          this.reservation.user_uuid = this.account.login_uuid;
          this.selectedUserUUID = this.account.login_uuid;
          this.setUpAsyncValidators();
          return EMPTY;
        }
      })
    ).subscribe((reservations) => {
      if (reservations.length > 0) {
        this.reservation = reservations[0];
        this.setValues();
      }
      this.setCanDelete();
      this.setUpAsyncValidators();
    });
  }

  private initializeForm(): void {
    this.reservationForm = this.fb.group({
      name: new FormControl('', Validators.required),
    }, {
      validators: TimeInputValidator.validateTimes,
      updateOn: 'blur'
    });
  }

  private setUpAsyncValidators(): void {
    this.reservationForm.setAsyncValidators(
      [TimeInputValidator.checkIfTimeSlotsTaken(this.reservationService, this.reservation.id_reservation)]);
    this.reservationForm.updateValueAndValidity();
  }

  private checkFormChange(): void {
    this.subscriptions.push(
      this.reservationForm.valueChanges.subscribe((val) => {
        this.hasSession = !!this.reservationForm.controls.type?.value || !!this.reservationForm.controls.project?.value;
        this.enableSave();
        const invalid = [];
        const controls = this.reservationForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }
      })
    );
  }

  private setValues(): void {
    const controls = this.reservationForm.controls;
    controls.name.setValue(this.reservation.name);
    this.startTime = new Date(this.reservation.reservation_start_datetime);
    this.endTime = new Date(this.reservation.reservation_end_datetime);
    this.selectedUserUUID = this.reservation.user_uuid;
    if (this.reservation.session) {
      this.hasSession = true;
      this.session = this.reservation.session[0];
      this.title = this.session.session_name;
      this.sessionParticipants = this.session.session_participants;
      this.idReservationProject = this.sessionParticipants[0].id_project;
    }
  }

  private setNewTime(time: Date): void {
    this.startTime = roundToNearestQuarter(time);
    this.endTime = roundToNearestQuarter(time);
    this.endTime.setHours(this.endTime.getHours() + 1);
  }

  validate(): void {
    if (this.reservationForm.invalid) {
      validateAllFields(this.reservationForm);
      return;
    }
    if (this.canSave) {
      this.createReservation();
      this.saveReservation();
    }
  }

  enableSave(): void {
    const inPast = this.reservationForm.controls.startTime && this.reservationForm.controls.startTime.value < this.today;
    this.canSave = this.reservationForm.valid && !this.isSessionMissingInformation() && !inPast;
  }

  private isSessionMissingInformation(): boolean {
    return this.hasSession && this.hasNoParticipant();
  }

  hasNoParticipant(): boolean {
    return this.sessionParticipants.length === 0;
  }

  private createReservation(): void {
    const controls = this.reservationForm.controls;
    const startTime = controls.startTime.value;
    const endTime = controls.endTime.value;
    this.reservation.name = controls.name.value;
    this.reservation.id_room = controls.room.value.id_room;
    this.reservation.reservation_start_datetime = dateToISOLikeButLocal(startTime);
    this.reservation.reservation_end_datetime = dateToISOLikeButLocal(endTime);
    this.reservation.user_uuid = controls.user.value.user_uuid;

    if (this.hasSession) {
      this.reservation.session = this.createSession();
      this.reservation.session.session_start_datetime = this.reservation.reservation_start_datetime;
      this.reservation.session.session_duration = getDuration(startTime, endTime);
      this.reservation.session_participant_uuids = this.sessionParticipants.map(a => a.participant_uuid);
    }
  }

  private createSession(): Session {
    const controls = this.reservationForm.controls;
    const session = new Session();
    session.session_name = controls.name.value;
    session.id_session = !isObjectEmpty(this.session) ? this.session.id_session : 0;
    session.session_users_uuids = [controls.user.value.user_uuid];
    session.session_status = 0;
    session.id_session_type = controls.type.value.id_session_type;
    session.session_participants_uuids = this.sessionParticipants.map(a => a.participant_uuid);
    return session;
  }

  private saveReservation(): void {
    this.reservationService.update(this.reservation).subscribe((result) => {
      this.router.navigate([Pages.calendarPage]);
      this.notificationService.showSuccess(`La réservation ${this.reservation.name} a été sauvegardée.`);
    });
  }

  participantsChange(participants: Participant[]): void {
    this.sessionParticipants = participants;
    this.enableSave();
  }

  cancel(): void {
    this.router.navigate([Pages.homePage]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Êtes-vous sûr de vouloir supprimer cette réservation?'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reservationService.delete(this.reservation.id_reservation).subscribe(() => {
          this.notificationService.showSuccess('La réservation ' + this.reservation.name + ' a été supprimée.');
        }, err => {
          console.error('Ce compte ne possède pas les permissions pour supprimer cette réservation.', err);
          this.notificationService.showError('Ce compte ne possède pas les permissions pour supprimer cette réservation.');
        });
      }
    });
  }

  private setCanDelete(): void {
    this.canDelete = isUser(this.account)
      && (this.permissions.site_admin // Either is site admin OR the connected user made the reservation
        || (!this.permissions.site_admin && this.reservation.user_uuid === this.account.login_uuid));
  }
}
