import {RoomService} from '../../services/room.service';
import {Room} from '../../core/models/room.model';
import {Site} from '../../core/models/site.model';
import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../components/confirmation-dialog/confirmation-dialog.component';
import {RoomFormDialogComponent} from '../../components/room-form-dialog/room-form-dialog.component';
import {NotificationService} from '../../services/notification.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, AfterViewInit {
  private selectedSite: Site;
  private refreshing: boolean;

  constructor(private roomService: RoomService,
              private notificationService: NotificationService,
              public dialog: MatDialog) {
    this.rooms = [];
    this.dataSource = new MatTableDataSource(this.rooms);
  }

  rooms: Room[];
  displayedColumns: string[] = ['room_name', 'controls'];
  dataSource: MatTableDataSource<Room>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getRooms();
  }

  selectedSiteChange(selected: Site) {
    if (selected) {
      this.selectedSite = selected;
      this.refreshRooms();
    } else {
      this.selectedSite = null;
      this.rooms = [];
    }
  }

  private getRooms() {
    this.roomService.roomsList$().subscribe((rooms) => {
      this.rooms = rooms;
      this.dataSource = new MatTableDataSource(rooms);
    });
  }

  private refreshRooms() {
    this.refreshing = true;
    this.roomService.getBySite(this.selectedSite.id_site).subscribe(() => {
      this.refreshing = false;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteRoom(idRoom: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Êtes-vous sûr de vouloir supprimer ce local?'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roomService.delete(idRoom).subscribe(() => {
          this.notificationService.showSuccess('Le local ' + idRoom + ' a été supprimé.');
        }, err => {
          console.error('Ce compte ne possède pas les permissions pour supprimer ce local.', err);
          this.notificationService.showError('Ce compte ne possède pas les permissions pour supprimer ce local.');
        });
      }
    });
  }

  openRoomFormDialog(row: any) {
    const copy = {...row};
    const dialogRef = this.dialog.open(RoomFormDialogComponent, {
      width: '500px',
      data: copy ? copy : new Room()
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result) {
        if (!result.id_room) {
          result.id_room = 0;
        }
        result.id_site = this.selectedSite.id_site;
        this.roomService.save(result).subscribe((updated: Room) => {
          this.notificationService.showSuccess('Le local ' + updated.room_name + ' a été sauvegardé.');
        });
      }
    });
  }
}
