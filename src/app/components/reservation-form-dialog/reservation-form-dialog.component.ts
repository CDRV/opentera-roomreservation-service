import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Room} from '../../core/models/room.model';

@Component({
  selector: 'app-reservation-form-dialog',
  templateUrl: './reservation-form-dialog.component.html',
  styleUrls: ['./reservation-form-dialog.component.scss']
})
export class ReservationFormDialogComponent {

  title: string;

  constructor(public dialogRef: MatDialogRef<ReservationFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.id_room) {
      this.title = 'Informations ' + data.user_name;
    } else {
      this.title = 'New room';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
