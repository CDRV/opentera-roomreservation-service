import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {Room} from '../../shared/models/room.model';

@Component({
  selector: 'app-room-selection',
  templateUrl: './room-selection.component.html',
  styleUrls: ['./room-selection.component.scss']
})
export class RoomSelectionComponent implements OnInit, OnChanges {
  @Output() selectedRoomChange = new EventEmitter();
  @Input() idSite: number;
  rooms = [];

  constructor(private roomService: RoomService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getRooms();
  }

  private getRooms() {
    if (this.idSite) {
      this.roomService.getBySite(this.idSite).subscribe(res => {
        this.rooms = res;
      });
    }
  }

  onValueChanged(selected: Room) {
    if (selected) {
      this.selectedRoomChange.emit(selected);
    } else {
      this.selectedRoomChange.emit(null);
    }
  }

}
