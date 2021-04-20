import {Injectable} from '@angular/core';
import {Site} from '@models/site.model';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedSiteService {
  private siteSubject: BehaviorSubject<Site> = new BehaviorSubject<Site>(new Site());

  constructor() {
  }

  public getSelectedSite(): Observable<Site> {
    return this.siteSubject.asObservable();
  }

  public setSelectedSite(site: Site) {
    this.siteSubject.next(site);
  }
}
