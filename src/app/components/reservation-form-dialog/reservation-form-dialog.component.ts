import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ScheduleService} from '../../services/schedule.service';
import {Reservation} from '../../core/models/reservation.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {NotificationService} from '../../services/notification.service';
import {Site} from '../../core/models/site.model';
import {Room} from '../../core/models/room.model';

@Component({
  selector: 'app-reservation-form-dialog',
  templateUrl: './reservation-form-dialog.component.html',
  styleUrls: ['./reservation-form-dialog.component.scss']
})
export class ReservationFormDialogComponent implements OnInit {
  reservation: Reservation;
  title: string;
  reservationForm: FormGroup;
  hasSession = false;
  selectedSite: Site;
  selectedRoom: Room;

  private static formatAMPM(d: Date): string {
    const date = new Date(d);
    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours !== 0 ? hours : 12;
    minutes = ('0' + minutes).slice(-2);
    return hours + ':' + minutes + ' ' + ampm;
  }

  constructor(public dialogRef: MatDialogRef<ReservationFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public dialog: MatDialog,
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
        this.scheduleService.delete(this.reservation.id_reservation).subscribe(() => {
          this.notificationService.showSuccess('La réservation ' + this.reservation.id_reservation + ' a été supprimée.');
          this.dialogRef.close();
        });
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.selectedRoom = new Room();
    this.selectedSite = new Site();
    console.log(this.data);
    if (this.data.id_reservation) {
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
      user: new FormControl({value: '', disabled: true}, Validators.required),
      startTime: new FormControl(ReservationFormDialogComponent.formatAMPM(today), Validators.required),
      endTime: new FormControl(ReservationFormDialogComponent.formatAMPM(inOneHour), Validators.required)
    });
  }

  getReservation() {
    this.scheduleService.getById(this.data.id_reservation).subscribe(reservation => {
      console.log(reservation);
      this.reservation = reservation[0];
      this.setValues();
    });
  }

  private setValues() {
    const startTime = new Date(this.reservation.reservation_start_datetime);
    const endTime = this.addDuration();

    this.reservationForm.controls.user.setValue(this.reservation.user_name);
    this.reservationForm.controls.startTime.setValue(ReservationFormDialogComponent.formatAMPM(startTime));
    this.reservationForm.controls.endTime.setValue(ReservationFormDialogComponent.formatAMPM(endTime));

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

  getStartTime() {
    const startTime = this.reservationForm.controls.startTime.value;
    return ReservationFormDialogComponent.formatAMPM(startTime);
  }

  selectedSiteChange(selectedSite: Site) {
    this.selectedSite = selectedSite;
  }

  selectedRoomChange(selectedRoom: Room) {
    this.selectedRoom = selectedRoom;
  }
}
