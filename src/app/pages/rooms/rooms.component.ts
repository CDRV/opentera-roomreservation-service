import {RoomService} from '../../services/room.service';
import {Room} from '../../shared/models/room.model';
import {Site} from '../../shared/models/site.model';
import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationDialogComponent} from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, AfterViewInit {

  constructor(private roomService: RoomService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
    this.rooms = [];
    this.dataSource = new MatTableDataSource(this.rooms);
  }

  rooms: Room[];
  displayedColumns: string[] = ['id_room', 'room_name', 'controls'];
  dataSource: MatTableDataSource<Room>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
  }

  selectedSiteChange(selected: Site) {
    if (selected) {
      this.getRooms(selected.id_site);
    } else {
      this.rooms = [];
    }
  }

  private getRooms(idSite: number) {
    this.roomService.getBySite(idSite).subscribe(rooms => {
      this.rooms = rooms;
      this.dataSource = new MatTableDataSource(rooms);
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.delete(idRoom).subscribe(() => {
          this.openSnackBar('Le local ' + idRoom + ' a été supprimé.', 'X');
        }, err => {
          console.error('Ce compte ne possède pas les permissions pour supprimer ce local.', err);
          this.openSnackBar('Ce compte ne possède pas les permissions pour supprimer ce local.', 'X');
        });
      }
    });
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  openUserGroupForm(row: any) {
    console.log(row);
  }
}
