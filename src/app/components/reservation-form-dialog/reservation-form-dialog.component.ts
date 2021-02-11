import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ScheduleService} from '../../services/schedule.service';
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
import {MatCheckboxChange} from '@angular/material/checkbox';
import {TimeValidator} from '../../shared/validators/time-validator';

@Component({
  selector: 'app-reservation-form-dialog',
  templateUrl: './reservation-form-dialog.component.html',
  styleUrls: ['./reservation-form-dialog.component.scss']
})
export class ReservationFormDialogComponent implements OnInit {
  idReservation: number;
  reservation: Reservation;
  title: string;
  reservationForm: FormGroup;
  hasSession = false;
  isSaveButtonEnabled = false;
  selectedSite: Site;
  selectedRoom: Room;
  selectedParticipants: Participant[] = [];
  private userInfos: UserInfos;
  private session: Session;
  private isCustomName = false;

  private static roundToNearestQuarter(date: Date): Date {
    const coefficient = 1000 * 60 * 15;
    return new Date(Math.round(date.getTime() / coefficient) * coefficient);
  }

  private static dateToISOLikeButLocal(date: Date): string {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const msLocal = date.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    const iso = dateLocal.toISOString();
    return iso.slice(0, 19);
  }

  constructor(public dialogRef: MatDialogRef<ReservationFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private userInfosService: UserInfosService,
              private notificationService: NotificationService,
              private scheduleService: ScheduleService) {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.delete(this.idReservation).subscribe(() => {
          this.notificationService.showSuccess('La réservation ' + this.idReservation + ' a été supprimée.');
          this.dialogRef.close();
        });
      }
    });
  }

  ngOnInit(): void {
    this.userInfosService.userInfos$().subscribe((infos: UserInfos) => {
      this.userInfos = infos;
      this.setDefaultName();
    });
    this.initializeForm();
    if (this.data.meta) {
      this.idReservation = this.data.meta.idReservation;
      this.getReservation();
    } else {
      this.reservation = new Reservation();
      this.title = 'Nouvelle réservation';
      this.enableSave();
    }
  }

  private initializeForm() {
    const today = ReservationFormDialogComponent.roundToNearestQuarter(new Date());
    const inOneHour = new Date(today);
    inOneHour.setHours(inOneHour.getHours() + 1);
    this.reservationForm = this.fb.group({
        name: new FormControl('', Validators.required),
        user: new FormControl({value: this.userInfos.user_fullname, disabled: true}, Validators.required),
        startDate: new FormControl(today, Validators.required),
        startTime: new FormControl(today, Validators.required),
        endTime: new FormControl(inOneHour, Validators.required),
        hasSession: new FormControl(false)
      },
      {
        validator: TimeValidator('endTime', 'startTime')
      });

  }

  getReservation() {
    this.scheduleService.getById(this.idReservation).subscribe(reservation => {
      this.reservation = reservation[0];
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
      this.reservationForm.controls.hasSession.setValue(true);
      this.selectedParticipants = this.session.session_participants;
    }
  }

  selectedSiteChange(selectedSite: Site) {
    this.selectedSite = selectedSite;
  }

  selectedRoomChange(selectedRoom: Room) {
    this.selectedRoom = selectedRoom;
    this.enableSave();
  }

  selectedParticipantChange(selectedParticipant: Participant) {
    console.log(selectedParticipant);
    const found = this.selectedParticipants.some(participant => participant.id_participant === selectedParticipant.id_participant);
    if (!found) {
      this.selectedParticipants.push(selectedParticipant);
    }
    this.enableSave();
  }

  enableSave() {
    if (this.reservationForm.invalid // If form has errors
      || !this.selectedRoom.hasOwnProperty('id_room') // No room selected
      || (this.hasSession && this.selectedParticipants?.length === 0)) { // Missing session's information
      this.validateAllFields(this.reservationForm); // Show errors in form
      this.isSaveButtonEnabled = false; // Disable save button
    } else {
      this.isSaveButtonEnabled = true;
    }
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
    newReservation.reservation_start_datetime = ReservationFormDialogComponent.dateToISOLikeButLocal(
      this.setDate(this.reservationForm.controls.startTime.value));
    newReservation.reservation_end_datetime = ReservationFormDialogComponent.dateToISOLikeButLocal(
      this.setDate(this.reservationForm.controls.endTime.value));
    newReservation.user_uuid = this.userInfos.user_uuid;
    newReservation.user_name = this.userInfos.user_fullname;

    if (this.hasSession) {
      newReservation.session = this.createSession();
      newReservation.session.session_start_datetime = this.reservation.reservation_start_datetime;
      newReservation.session.session_duration = this.getDuration(this.reservationForm.controls.startTime.value,
        this.reservationForm.controls.endTime.value);
    }

    return newReservation;
  }

  private setDate(formValue: any): Date {
    const date: Date = new Date(this.reservationForm.controls.startDate.value);
    const time: Date = formValue;
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return date;
  }

  private getDuration(startString: string, endString: string): number {
    const start = this.setDate(startString);
    const end = this.setDate(endString);
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / 60000);
  }

  private createSession(): Session {
    const session = new Session();
    session.session_name = this.reservationForm.controls.name.value;
    session.id_session = this.session?.id_session ? this.session.id_session : 0;
    session.session_users_uuids = [this.userInfos.user_uuid];
    session.session_status = 0;
    session.session_participants_uuids = this.selectedParticipants.map(a => a.participant_uuid);
    return session;
  }

  change($event: any) {
    this.enableSave();
  }

  changeSession(event: MatCheckboxChange) {
    this.hasSession = event.checked;
    this.setDefaultName();
    this.enableSave();
  }

  deleteParticipant(id: number) {
    this.selectedParticipants = this.selectedParticipants.filter(participant => participant.id_participant !== id);
  }

  startTimeAfterEndTime(): boolean {
    return this.reservationForm.controls.endTime.hasError('startTimeAfterEndTime');
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
      if (this.hasSession) {
        defaultName = 'Séance de téléréadaptation';
      } else {
        defaultName = !!this.userInfos.user_fullname ? 'Réservation pour ' + this.userInfos.user_fullname : 'Réservation';
      }
      this.reservationForm.controls.name.setValue(defaultName);
    }
  }

  reservationNameChange() {
    this.isCustomName = true;
  }
}
