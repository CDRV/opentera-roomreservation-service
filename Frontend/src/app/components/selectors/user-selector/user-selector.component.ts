import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {User} from '@shared/models/user.model';
import {UserService} from '@services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalConstants} from '@core/utils/global-constants';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {PermissionsService} from '@services/permissions.service';
import {switchMap} from 'rxjs/operators';
import {SelectedSiteService} from '@services/selected-site.service';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.scss']
})
export class UserSelectorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() idSite: number;
  @Input() selectedUserUUID: string;
  @Input() form: FormGroup;
  users: User[] = [];
  selectedUser: User;
  required = GlobalConstants.requiredMessage;
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private permissionsService: PermissionsService,
              private selectedSiteService: SelectedSiteService) {
  }

  ngOnInit(): void {
    this.form.addControl('user', new FormControl('', [Validators.required]));
    this.getPermissions();
    this.getUsers();
  }

  private getPermissions(): void {
    const permissions$ = this.permissionsService.permissions$();
    const site$ = this.selectedSiteService.getSelectedSite();
    this.subscriptions.push(
      combineLatest([permissions$, site$]).pipe(
        switchMap(([permissions, site]) => {
          permissions.site_admin ? this.form.controls.user.enable() : this.form.controls.user.disable();
          return this.refreshUsers(site.id_site);
        })
      ).subscribe()
    );
  }

  private getUsers(): void {
    this.userService.users$().subscribe((users) => {
      this.users = users;
      this.selectUser();
    });
  }

  private refreshUsers(idSite: number): Observable<User[]> {
    return this.userService.getBySite(idSite);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectUser();
  }

  private selectUser(): void {
    const alreadySelected = this.users.find(p => p.user_uuid === this.selectedUserUUID);
    if (alreadySelected) {
      this.form.controls.user.setValue(alreadySelected);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
