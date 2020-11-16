import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SiteService} from '../../services/site.service';
import {Site} from '../../shared/models/site.model';

@Component({
  selector: 'app-site-selection',
  templateUrl: './site-selection.component.html',
  styleUrls: ['./site-selection.component.scss']
})
export class SiteSelectionComponent implements OnInit {
  @Output() selectedSiteChange = new EventEmitter();
  sites = [];

  constructor(private siteService: SiteService) {
  }

  ngOnInit() {
    this.siteService.getAccessibleSites().subscribe(res => {
      this.sites = res;
    });
  }

  onValueChanged(selected: Site) {
    if (selected) {
      this.selectedSiteChange.emit(selected);
    } else {
      this.selectedSiteChange.emit(null);
    }
  }
}
