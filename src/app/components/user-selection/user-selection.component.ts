import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {User} from '@models/user.model';
import {UserService} from '@services/user.service';
import {Room} from '@models/room.model';

@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent implements OnInit, OnChanges {
  @Output() selectedUserChange = new EventEmitter();
  @Input() idSite: number;
  @Input() uuidUser: string;
  @Input() disabled: boolean;
  users: User[] = [];
  selectedOption: any;
  refreshing: boolean;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshUsers();
  }

  private getUsers() {
    this.userService.usersList$().subscribe((users) => {
      this.selectUser();
      this.users = users;
    });
  }

  private refreshUsers() {
    if (this.idSite) {
      this.refreshing = true;
      this.userService.getBySite(this.idSite).subscribe(() => {
        this.selectUser();
        this.refreshing = false;
      });
    }
  }

  onValueChanged(event: any) {
    if (event.value) {
      const selected: Room = event.value;
      this.selectedUserChange.emit(selected);
    } else {
      this.selectedUserChange.emit(null);
    }
  }

  private selectUser() {
    const alreadySelected = this.users.find(user => user.user_uuid === this.uuidUser);
    if (alreadySelected) {
      this.selectedOption = alreadySelected;
    }
  }
}
