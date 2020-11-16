import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Room} from '../../shared/models/room.model';

@Component({
  selector: 'app-room-form-dialog',
  templateUrl: './room-form-dialog.component.html',
  styleUrls: ['./room-form-dialog.component.scss']
})
export class RoomFormDialogComponent {
  title: string;

  constructor(public dialogRef: MatDialogRef<RoomFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Room) {
    if (data.id_room) {
      this.title = 'Informations ' + data.room_name;
    } else {
      this.title = 'New room';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
