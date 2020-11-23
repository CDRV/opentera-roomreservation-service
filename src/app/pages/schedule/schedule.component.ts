import {Component, OnInit} from '@angular/core';
import {Site} from '../../core/models/site.model';
import {Room} from '../../core/models/room.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  selectedSite: Site;
  selectedRoom: Room;

  constructor() {
    this.selectedSite = new Site();
    this.selectedRoom = new Room();
  }

  ngOnInit(): void {
  }

  selectedSiteChange(selectedSite: Site) {
    this.selectedSite = selectedSite;
  }

  selectedRoomChange(selectedRoom: Room) {
    this.selectedRoom = selectedRoom;
  }
}
