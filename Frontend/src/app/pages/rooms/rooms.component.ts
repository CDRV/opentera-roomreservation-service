import {RoomService} from '@services/room.service';
import {AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '@components/confirmation-dialog/confirmation-dialog.component';
import {RoomFormDialogComponent} from '@components/forms/room-form-dialog/room-form-dialog.component';
import {NotificationService} from '@services/notification.service';
import {take} from 'rxjs/operators';
import {Site} from '@shared/models/site.model';
import {Room} from '@shared/models/room.model';
import {SelectedSiteService} from '@services/selected-site.service';
import {Subscription} from 'rxjs';
import {isObjectEmpty} from '@core/utils/utility-functions';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, AfterViewInit, OnDestroy {
  private selectedSite: Site;
  private refreshing: boolean;
  private subscription: Subscription;

  constructor(private roomService: RoomService,
              private notificationService: NotificationService,
              private selectedSiteService: SelectedSiteService,
              public dialog: MatDialog) {
    this.rooms = [];
    this.dataSource = new MatTableDataSource(this.rooms);
  }

  rooms: Room[];
  displayedColumns: string[] = ['room_name', 'site_name', 'controls'];
  dataSource: MatTableDataSource<Room>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getSelectedSite();
    this.getRooms();
  }

  private getSelectedSite(): void {
    this.subscription = this.selectedSiteService.getSelectedSite().subscribe((site) => {
      this.selectedSite = site;
      this.refreshRooms();
    });
  }

  private getRooms(): void {
    this.roomService.rooms$().subscribe((rooms) => {
      this.rooms = rooms;
      this.dataSource = new MatTableDataSource(rooms);
    });
  }

  private refreshRooms(): void {
    this.refreshing = true;
    if (!isObjectEmpty(this.selectedSite)) {
      this.roomService.getBySite(this.selectedSite.id_site).subscribe(() => {
        this.refreshing = false;
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteRoom(idRoom: number): void {
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

  openRoomFormDialog(row: Room): void {
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
        this.roomService.update(result).subscribe((updated: Room) => {
          this.notificationService.showSuccess('Le local ' + result.room_name + ' a été sauvegardé.');
          this.refreshRooms();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
