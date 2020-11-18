import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {Room} from '../../core/models/room.model';
import {MatTableDataSource} from '@angular/material/table';
import {Site} from '../../core/models/site.model';

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
      this.roomService.getBySite(this.idSite);
      this.roomService.roomsList$().subscribe(rooms => {
        this.rooms = rooms;
      });
    }
  }

  onValueChanged(event: any) {
    const selected: Room = event.value;
    console.log(selected);
    if (selected) {
      this.selectedRoomChange.emit(selected);
    } else {
      this.selectedRoomChange.emit(null);
    }
  }

}
