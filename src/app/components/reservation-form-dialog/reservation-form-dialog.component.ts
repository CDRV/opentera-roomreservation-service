import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ReservationService} from '../../services/reservation.service';
import {Reservation} from '../../core/models/reservation.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {NotificationService} from '../../services/notification.service';
import {Site} from '../../core/models/site.model';
import {Room} from '../../core/models/room.model';
import {Participant} from '../../core/models/participant.model';
import {Session} from '../../core/models/session.model';
import {UserInfosService} from '../../services/user-infos.service';
import {UserInfos} from '../../core/models/user-infos.model';
import {TimeInputValidator} from '../../shared/validators/time-validator';
import {SessionType} from '../../core/models/session-type.model';
import {ReservationTimeInputValidator} from '../../shared/validators/reservation-time-validator';
import {dateToISOLikeButLocal, getDuration, setDate} from '../../core/utils/utility-functions';
import {User} from '../../core/models/user.model';

@Component({
  selector: 'app-reservation-form-dialog',
  templateUrl: './reservation-form-dialog.component.html',
  styleUrls: ['./reservation-form-dialog.component.scss']
})
export class ReservationFormDialogComponent implements OnInit {
  idReservation: number;
  reservation: Reservation;
  title: string;
  inOneHour: Date;
  today: Date;
  uuidUser: string;
  reservationForm: FormGroup;
  hasSession = false;
  isSaveButtonEnabled = false;
  idReservationProject: number;
  session: Session;
  selectedSite: Site;
  selectedRoom: Room;
  selectedProjectId: number;
  selectedParticipants: Participant[] = [];
  private userInfos: UserInfos;
  private isCustomName = false;
  private selectedSessionType: SessionType;
  private selectedUser: User;

  private static roundToNearestQuarter(date: Date): Date {
    const coefficient = 1000 * 60 * 15;
    return new Date(Math.round(date.getTime() / coefficient) * coefficient);
  }

  constructor(public dialogRef: MatDialogRef<ReservationFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private userInfosService: UserInfosService,
              private notificationService: NotificationService,
              private reservationService: ReservationService) {
    this.selectedRoom = new Room();
    this.selectedSite = new Site();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Êtes-vous sûr de vouloir supprimer cette réservation?'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reservationService.delete(this.idReservation).subscribe(() => {
          this.notificationService.showSuccess('La réservation ' + this.idReservation + ' a été supprimée.');
          this.dialogRef.close();
        });
      }
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.initializeForm();
    if (this.data.meta) {
      this.idReservation = this.data.meta.idReservation;
      this.getReservation();
    } else {
      this.reservation = new Reservation();
      this.title = 'Nouvelle réservation';
      this.isSaveButtonEnabled = false;
    }
    this.setDefaultName();
  }

  private getUserInfo() {
    this.userInfosService.userInfos$().subscribe((infos: UserInfos) => {
      this.userInfos = infos;
      this.uuidUser = this.userInfos.user_uuid;
      this.setDefaultName();
    });
  }

  private initializeForm() {
    this.today = ReservationFormDialogComponent.roundToNearestQuarter(new Date());
    this.inOneHour = ReservationFormDialogComponent.roundToNearestQuarter(new Date());
    this.inOneHour.setHours(this.inOneHour.getHours() + 1);
    this.reservationForm = this.fb.group({
      name: new FormControl('', Validators.required),
      user: new FormControl({value: this.userInfos.user_fullname, disabled: true}, Validators.required),
      startDate: new FormControl(this.today, Validators.required),
      startTime: new FormControl(this.today, Validators.required),
      endTime: new FormControl(this.inOneHour, Validators.required)
    }, {
      validators: TimeInputValidator.validateTimes,
      asyncValidators: ReservationTimeInputValidator.checkIfTimeSlotsTaken(this.reservationService, this.selectedRoom.id_room)
    });
  }

  getReservation() {
    this.reservationService.getById(this.idReservation).subscribe((reservation) => {
      this.reservation = reservation[0];
      this.uuidUser = this.reservation.user_uuid;
      this.setValues();
      this.enableSave();
    });
  }

  private setValues() {
    const startTime = new Date(this.reservation.reservation_start_datetime);
    const endTime = new Date(this.reservation.reservation_end_datetime);
    this.title = 'Informations de la réservation à ' + this.reservation.user_name;
    this.reservationForm.controls.name.setValue(this.reservation.name);
    this.reservationForm.controls.user.setValue(this.reservation.user_name);
    this.reservationForm.controls.startDate.setValue(startTime);
    this.reservationForm.controls.startTime.setValue(startTime);
    this.reservationForm.controls.endTime.setValue(endTime);

    if (this.reservation.session) {
      this.session = this.reservation.session[0];
      this.title = this.session.session_name;
      this.hasSession = true;
      this.selectedParticipants = this.session.session_participants;
      this.idReservationProject = this.selectedParticipants[0].id_project;
    }
  }

  selectedSiteChange(selectedSite: Site) {
    this.selectedSite = selectedSite;
  }

  selectedRoomChange(selectedRoom: Room) {
    this.selectedRoom = selectedRoom;
    this.setupFormValidators();
    this.enableSave();
  }

  private setupFormValidators() {
    this.reservationForm.clearAsyncValidators();
    this.reservationForm.setAsyncValidators([
      ReservationTimeInputValidator.checkIfTimeSlotsTaken(this.reservationService, this.selectedRoom.id_room)]);
    this.reservationForm.updateValueAndValidity();
  }

  selectedParticipantsChange(selectedParticipants: Participant[]) {
    this.selectedParticipants = selectedParticipants;
    this.enableSave();
  }

  enableSave() {
    if (this.reservationForm.invalid // If form has errors
      || !this.selectedUser // No user selected for reservation
      || !this.selectedRoom.hasOwnProperty('id_room') // No room selected
      || this.isSessionMissingInformation()) {
      this.validateAllFields(this.reservationForm); // Show errors in form
      this.isSaveButtonEnabled = false; // Disable save button
    } else {
      this.isSaveButtonEnabled = true;
    }
  }

  private isSessionMissingInformation(): boolean {
    return this.hasSession && (this.hasNoParticipant() || !this.selectedProjectId || !this.selectedSessionType);
  }

  validate() {
    const reservation = this.createReservation();
    this.dialogRef.close(reservation);
  }

  private validateAllFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  private createReservation(): Reservation {
    const newReservation = new Reservation();
    newReservation.id_reservation = this.reservation.id_reservation ? this.reservation.id_reservation : 0;
    newReservation.name = this.reservationForm.controls.name.value;
    newReservation.id_room = this.selectedRoom.id_room;
    newReservation.reservation_start_datetime = dateToISOLikeButLocal(
      setDate(this.reservationForm.controls.startDate.value, this.reservationForm.controls.startTime.value));
    newReservation.reservation_end_datetime = dateToISOLikeButLocal(
      setDate(this.reservationForm.controls.startDate.value, this.reservationForm.controls.endTime.value));
    newReservation.user_uuid = this.userInfos.user_uuid;
    newReservation.user_name = this.userInfos.user_fullname;

    if (this.hasSession) {
      newReservation.session = this.createSession();
      newReservation.session.session_start_datetime = this.reservation.reservation_start_datetime;
      newReservation.session.session_duration = getDuration(this.reservationForm.controls.startTime.value,
        this.reservationForm.controls.endTime.value, this.reservationForm.controls.startDate.value);
    }
    return newReservation;
  }

  private createSession(): Session {
    const session = new Session();
    session.session_name = this.reservationForm.controls.name.value;
    session.id_session = this.session?.id_session ? this.session.id_session : 0;
    session.session_users_uuids = [this.userInfos.user_uuid];
    session.session_status = 0;
    session.id_session_type = this.selectedSessionType.id_session_type;
    session.session_participants_uuids = this.selectedParticipants.map(a => a.participant_uuid);
    return session;
  }

  change(event: any) {
    this.enableSave();
  }

  startTimeAfterEndTime(): boolean {
    return this.reservationForm.controls.endTime.hasError('startTimeAfterEndTime');
  }

  reservationPeriodsOverlapping(): boolean {
    return this.reservationForm.hasError('timesOverlapping');
  }

  siteIsNotSelected(): boolean {
    return !this.selectedSite.id_site;
  }

  roomIsNotSelected(): boolean {
    return !this.selectedRoom.id_room;
  }

  hasNoParticipant(): boolean {
    return this.selectedParticipants.length === 0;
  }

  private setDefaultName() {
    if (!!this.reservationForm && (!this.reservationForm.controls.name.value || !this.isCustomName)) {
      let defaultName = '';
      if (this.selectedUser) {
        defaultName = !!this.userInfos.user_fullname ? `Réservation pour ${this.selectedUser.user_firstname} ${this.selectedUser.user_lastname}` : 'Réservation';
      } else {
        defaultName = !!this.userInfos.user_fullname ? `Réservation pour ${this.userInfos.user_fullname}` : 'Réservation';
      }
      this.reservationForm.controls.name.setValue(defaultName);
    }
  }

  reservationNameChange() {
    this.isCustomName = true;
  }

  selectedProjectIdChange(selectedProjectId: number) {
    this.selectedProjectId = selectedProjectId;
    this.hasSession = !!selectedProjectId;
    this.enableSave();
  }

  selectedSessionTypeChange(selectedSessionType: SessionType) {
    this.selectedSessionType = selectedSessionType;
    this.enableSave();
  }

  selectedUserChange(selectedUser: User) {
    this.selectedUser = selectedUser;
    this.setDefaultName();
    this.enableSave();
  }
}
