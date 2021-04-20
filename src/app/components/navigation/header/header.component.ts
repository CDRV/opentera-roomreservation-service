import {Component, OnInit} from '@angular/core';
import {UserInfos} from '@models/user-infos.model';
import {SelectedSiteService} from '@services/selected-site.service';
import {UserInfosService} from '@services/user-infos.service';
import {combineLatest} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userInfos: UserInfos;
  private idSite: number;

  constructor(public router: Router,
              private selectedSiteService: SelectedSiteService,
              private userInfosService: UserInfosService) {
  }

  ngOnInit(): void {
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
    this.userInfosService.getWithToken(this.idSite).subscribe();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
