import {Component, OnInit} from '@angular/core';
import {SelectedSiteService} from '@services/selected-site.service';
import {combineLatest} from 'rxjs';
import {Router} from '@angular/router';
import {AccountService} from '@services/account.service';
import {Pages} from '@core/utils/pages';
import {Account} from '@shared/models/account.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  account: Account;
  private idSite: number;

  constructor(public router: Router,
              private selectedSiteService: SelectedSiteService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    combineLatest([
      this.accountService.account$(),
      this.selectedSiteService.getSelectedSite()
    ]).subscribe(([infos, site]) => {
      this.account = infos;
      this.idSite = site ? site.id_site : null;
    });
  }

  goHome() {
    this.router.navigate([Pages.homePage]);
  }
}
