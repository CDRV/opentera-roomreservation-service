import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {UserInfosService} from '../../../services/user-infos.service';
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private refreshing: boolean;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private authService: AuthenticationService,
              private userInfosService: UserInfosService,
              public router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 1000px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  mobileQuery: MediaQueryList;

  private readonly mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.refreshUserInfos();
  }

  private refreshUserInfos() {
    this.refreshing = true;
    this.userInfosService.getWithToken().subscribe(() => {
      this.refreshing = false;
    });
  }

  logout() {
    this.authService.logOut().subscribe();
  }
}
