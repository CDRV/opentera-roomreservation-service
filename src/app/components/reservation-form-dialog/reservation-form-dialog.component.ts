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
  isFormValid = false;
  selectedSite: Site;
  selectedRoom: Room;
  selectedParticipants: Participant[] = [];
  private userInfos: UserInfos;

  constructor(public dialogRef: MatDialogRef<ReservationFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private userInfosService: UserInfosService,
              private notificationService: NotificationService,
              private scheduleService: ScheduleService) {
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
    });
    this.initializeForm();
    this.selectedRoom = new Room();
    this.selectedSite = new Site();
    if (this.data.meta) {
      this.idReservation = this.data.meta;
      this.title = 'Informations ' + this.data.user_name;
      this.getReservation();
    } else {
      this.reservation = new Reservation();
      this.title = 'New reservation';
    }
  }

  private initializeForm() {
    const today = new Date();
    const inOneHour = new Date();
    inOneHour.setHours(inOneHour.getHours() + 1);
    this.reservationForm = this.fb.group({
      user: new FormControl({value: this.userInfos.user_fullname, disabled: true}, Validators.required),
      startDate: new FormControl(today, Validators.required),
      startTime: new FormControl(today, Validators.required),
      endTime: new FormControl(inOneHour, Validators.required),
      test: new FormControl('')
    });
  }

  getReservation() {
    this.scheduleService.getById(this.idReservation).subscribe(reservation => {
      this.reservation = reservation[0];
      this.setValues();
    });
  }

  private setValues() {
    const startTime = new Date(this.reservation.reservation_start_datetime);
    const endTime = this.addDuration();

    this.reservationForm.controls.user.setValue(this.reservation.user_name);
    this.reservationForm.controls.startDate.setValue(startTime);
    this.reservationForm.controls.startTime.setValue(startTime);
    this.reservationForm.controls.endTime.setValue(endTime);

    if (this.reservation.session) {
      console.log(this.reservation.session);
    }
  }

  private addDuration(): Date {
    const endTime = new Date(this.reservation.reservation_start_datetime);
    const duration = this.reservation.reservation_duration;
    const hours = Math.floor(duration);
    const minutes = duration % 1;
    endTime.setHours(endTime.getHours() + hours);
    endTime.setMinutes(endTime.getMinutes() + minutes);
    return endTime;
  }

  selectedSiteChange(selectedSite: Site) {
    this.selectedSite = selectedSite;
  }

  selectedRoomChange(selectedRoom: Room) {
    this.selectedRoom = selectedRoom;
  }

  selectedParticipantChange(selectedParticipant: Participant) {
    this.selectedParticipants.push(selectedParticipant);
  }

  validate() {
    if (this.reservationForm.invalid || !this.selectedRoom) {
      this.validateAllFields(this.reservationForm);
      return;
    }
    if (!this.reservationForm.pristine) {
      console.log('pristine');
    }
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
    const reservation = new Reservation();
    reservation.id_reservation = reservation.id_reservation ? reservation.id_reservation : 0;
    reservation.id_room = this.selectedRoom.id_room;
    reservation.reservation_start_datetime = this.setStartDate();
    reservation.reservation_duration = this.getDuration();
    reservation.user_uuid = this.userInfos.user_uuid;
    reservation.user_name = this.userInfos.user_fullname;
    //reservation.session = this.createSession();
    return reservation;
  }

  private setStartDate(): Date {
    const date: Date = this.reservationForm.controls.startDate.value;
    const time: Date = this.reservationForm.controls.startTime.value;
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return date;
  }

  private getDuration(): number {
    const start = this.reservationForm.controls.startTime.value;
    const end = this.reservationForm.controls.endTime.value;
    const startTime = start.getTime();
    const endTime = end.getTime();
    const diff = endTime - startTime;
    const diffInHours = diff / 1000 / 60 / 60;
    return Math.round((diffInHours + Number.EPSILON) * 100) / 100;
  }

  private createSession(): Session {
    const session = new Session();
    session.session_participants_ids = this.selectedParticipants.map(a => a.id_participant);
    return session;
  }
}
