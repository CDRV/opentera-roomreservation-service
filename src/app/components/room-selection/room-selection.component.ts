import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {Room} from '../../core/models/room.model';
import {SelectedRoomService} from '../../services/selected-room.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-room-selection',
  templateUrl: './room-selection.component.html',
  styleUrls: ['./room-selection.component.scss']
})
export class RoomSelectionComponent implements OnInit, OnChanges {
  @Output() selectedRoomChange = new EventEmitter();
  @Input() idSite: number;
  rooms = [];
  selectedOption: any;
  refreshing: boolean;

  constructor(private roomService: RoomService,
              private selectedRoomService: SelectedRoomService) {
  }

  ngOnInit(): void {
    this.getRooms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshRooms();
  }

  private getRooms() {
    this.roomService.roomsList$().pipe(
      switchMap(rooms => {
        this.rooms = rooms;
        return this.selectedRoomService.getSelectedRoom();
      })
    ).subscribe(room => {
      if (room && room.id_room) {
        const alreadySelected = this.rooms.find(p => p.id_room === room.id_room);
        if (alreadySelected) {
          this.selectedOption = alreadySelected;
          this.selectedRoomChange.emit(alreadySelected);
        }
      }
    });
  }

  private refreshRooms() {
    if (this.idSite) {
      this.refreshing = true;
      this.roomService.getBySite(this.idSite).subscribe(res => {
        this.refreshing = false;
      });
    }
  }

  onValueChanged(event: any) {
    if (event.value) {
      const selected: Room = event.value;
      this.selectedRoomService.setSelectedRoom(selected);
      this.selectedRoomChange.emit(selected);
    } else {
      this.selectedRoomChange.emit(null);
    }
  }

}
