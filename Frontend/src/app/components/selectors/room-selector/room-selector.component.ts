import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {RoomService} from '@services/room.service';
import {SelectedRoomService} from '@services/selected-room.service';
import {distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {Room} from '@shared/models/room.model';
import {SelectedSiteService} from '@services/selected-site.service';
import {combineLatest, Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Site} from '@shared/models/site.model';
import {GlobalConstants} from '@core/utils/global-constants';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss']
})
export class RoomSelectorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form: FormGroup = new FormGroup({room: new FormControl('')});
  rooms: Room[] = [];
  selectedOption: Room;
  required = GlobalConstants.requiredMessage;
  private subscriptions: Subscription[] = [];

  private static isSiteValid(site: Site): boolean {
    return !!site && !!site.id_site;
  }

  constructor(private roomService: RoomService,
              private fb: FormBuilder,
              private selectedSiteService: SelectedSiteService,
              private selectedRoomService: SelectedRoomService) {
  }

  ngOnInit(): void {
    this.refreshRooms();
    const room$ = this.selectedRoomService.getSelectedRoom();
    this.subscriptions.push(
      room$.subscribe((room) => {
        this.form.controls.room.setValue(room);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.form) {
      this.addControlToForm();
    }
  }

  private addControlToForm(): void {
    this.form.addControl('room', new FormControl('', [Validators.required]));
  }

  private refreshRooms(): void {
    const site$ = this.selectedSiteService.getSelectedSite();
    this.subscriptions.push(
      site$.pipe(
        distinctUntilChanged((a, b) => a.id_site === b.id_site),
        filter((site) => RoomSelectorComponent.isSiteValid(site)),
        switchMap((site) => {
          return this.roomService.getBySite(site.id_site);
        })
      ).subscribe((rooms) => {
        this.rooms = rooms;
        this.selectFirst();
      })
    );
  }

  private selectFirst(): void {
    if (!!this.rooms) {
      this.onValueChanged(this.rooms[0]);
    }
  }

  onValueChanged(selected: Room): void {
    if (selected) {
      this.selectedRoomService.setSelectedRoom(selected);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
