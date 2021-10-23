import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '@services/authentication.service';
import {AccountService} from '@services/account.service';
import {Account} from '@shared/models/account.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  account: Account;
  initial = '';
  private subscription: Subscription;

  constructor(private authService: AuthenticationService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.subscription = this.accountService.account$().subscribe((account) => {
      this.account = account;
      this.initial = this.account.fullname.charAt(0);
    });
  }

  logout() {
    this.authService.logout().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
