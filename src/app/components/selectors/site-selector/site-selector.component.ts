import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {SiteService} from '@services/site.service';
import {SelectedSiteService} from '@services/selected-site.service';
import {distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {AccountService} from '@services/account.service';
import {Site} from '@shared/models/site.model';
import {PermissionsService} from '@services/permissions.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {Permission} from '@shared/models/permission.model';
import {GlobalConstants} from '@core/utils/global-constants';

@Component({
  selector: 'app-site-selector',
  templateUrl: './site-selector.component.html',
  styleUrls: ['./site-selector.component.scss']
})
export class SiteSelectorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form: FormGroup = new FormGroup({ site: new FormControl('')});
  @Input() site: Site = null;
  sites: Site[] = [];
  selectedSite: Site;
  managesSites = false;
  required = GlobalConstants.requiredMessage;
  private subscription: Subscription;

  private static filterSite(site: Site): boolean {
    return !!site && !!site.id_site;
  }

  constructor(private fb: FormBuilder,
              private siteService: SiteService,
              private accountService: AccountService,
              private permissionsService: PermissionsService,
              private selectedSiteService: SelectedSiteService) {
  }

  ngOnInit(): void {
    this.getSite();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshSites();
    if (changes.form) {
      this.addControlToForm();
    }
  }

  private addControlToForm(): void {
    this.form.addControl('site', new FormControl('', [Validators.required]));
    if (this.site) {
      this.form.controls.site.setValue(this.site);
    }
  }

  private getSite(): void {
    const selectedSite$ = this.selectedSiteService.getSelectedSite();
    const account$ = this.accountService.account$();

    this.subscription = combineLatest([selectedSite$, account$]).pipe(
      distinctUntilChanged((a, b) => a[0].id_site === b[0].id_site),
      tap(([site, account]) => {
        this.sites = account.sites;
        this.managesSites = !!this.sites && this.sites.length > 0;
      }),
      filter(([site, account]) => SiteSelectorComponent.filterSite(site)),
      switchMap(([site, account]) => {
        this.selectedSite = site;
        this.form.controls.site.setValue(site);
        return this.getSitePermission(this.selectedSite);
      })
    ).subscribe();
  }

  refreshSites(): void {
    if (!!this.sites && this.sites.length === 1) {
      this.onValueChanged(this.sites[0]);
    }
  }

  onValueChanged(selected: Site): void {
    if (selected) {
      this.selectedSiteService.setSelectedSite(selected);
      this.getSitePermission(selected).subscribe();
    }
  }

  private getSitePermission(site: Site): Observable<Permission> {
    return this.permissionsService.getSitePermission(site.id_site);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
