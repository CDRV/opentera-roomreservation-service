import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Room} from '@shared/models/room.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {validateAllFields} from '@core/utils/validate-form';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-room-form-dialog',
  templateUrl: './room-form-dialog.component.html',
  styleUrls: ['./room-form-dialog.component.scss']
})
export class RoomFormDialogComponent implements OnInit, OnDestroy {
  title: string;
  roomForm: FormGroup;
  canSave = false;
  room: Room;
  private subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<RoomFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Room,
              private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.initializeForm();
    this.checkFormChange();
    this.room = this.data;
    if (this.room.id_room) {
      this.title = 'Informations de ' + this.room.room_name;
    } else {
      this.room.id_room = 0;
      this.title = 'Nouveau local';
    }
    this.setValues();
  }

  private checkFormChange(): void {
    this.subscriptions.push(
      this.roomForm.valueChanges.subscribe(() => {
        this.canSave = !this.roomForm.invalid;
      })
    );
  }

  private initializeForm(): void {
    this.roomForm = this.fb.group({
      name: new FormControl('', Validators.required),
    });
  }

  private setValues(): void {
    this.roomForm.controls.name.setValue(this.room.room_name);
  }

  validate(): void {
    if (this.roomForm.invalid) {
      validateAllFields(this.roomForm);
      return;
    }
    if (this.canSave) {
      this.createRoom();
      this.dialogRef.close(this.room);
    }
  }

  private createRoom(): void {
    const controls = this.roomForm.controls;
    this.room.room_name = controls.name.value;
    this.room.id_site = controls.site.value.id_site;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
