import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {UserInfosService} from '../../../services/user-infos.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {GlobalConstants} from '../../../core/utils/global-constants';
import {UserInfos} from '../../../core/models/user-infos.model';
import {combineLatest} from 'rxjs';
import {SelectedSiteService} from '../../../services/selected-site.service';
import {Site} from '../../../core/models/site.model';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private refreshing: boolean;
  version = GlobalConstants.version;
  organism = GlobalConstants.organism;
  userInfos: UserInfos;
  private idSite: number;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private selectedSiteService: SelectedSiteService,
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
    this.userInfosService.userInfos$().subscribe((infos: UserInfos) => {
      this.userInfos = infos;
    });

    combineLatest([
      this.userInfosService.userInfos$(),
      this.selectedSiteService.getSelectedSite()
    ]).subscribe(([infos, site]) => {
      this.userInfos = infos;
      this.idSite = site ? site.id_site : null;
    });
    this.refreshUserInfos();
  }

  private refreshUserInfos() {
    this.refreshing = true;
    this.userInfosService.getWithToken(this.idSite).subscribe(() => {
      this.refreshing = false;
    });
  }

  logout() {
    this.authService.logOut().subscribe();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
