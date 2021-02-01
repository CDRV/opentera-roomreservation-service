import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SiteService} from '../../services/site.service';
import {Site} from '../../core/models/site.model';
import {SelectedSiteService} from '../../services/selected-site.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-site-selection',
  templateUrl: './site-selection.component.html',
  styleUrls: ['./site-selection.component.scss']
})
export class SiteSelectionComponent implements OnInit {
  @Output() selectedSiteChange = new EventEmitter();
  sites = [];
  selectedOption: any;
  refreshing: boolean;

  constructor(private siteService: SiteService,
              private selectedSiteService: SelectedSiteService) {
  }

  ngOnInit() {
    this.refreshing = true;
    this.siteService.getAccessibleSites().pipe(
      switchMap(res => {
        this.sites = res;
        return this.selectedSiteService.getSelectedSite();
      })
    ).subscribe(site => {
      if (site && site.id_site) {
        const alreadySelected = this.sites.find(p => p.id_site === site.id_site);
        if (alreadySelected) {
          this.selectedOption = alreadySelected;
        }
      } else {
        this.selectedOption = this.sites[0];
      }
      this.selectedSiteChange.emit(this.selectedOption);
      this.refreshing = false;
    });
  }

  onValueChanged(event: any) {
    if (event.value) {
      const selected: Site = event.value;
      this.selectedSiteService.setSelectedSite(selected);
      this.selectedSiteChange.emit(selected);
    } else {
      this.selectedSiteChange.emit(null);
    }
  }
}
