import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {makeApiURL} from '../core/utils/make-api-url';
import {Site} from '../core/models/site.model';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private API_URL = makeApiURL();
  private controller = 'user/sites';

  constructor(private http: HttpClient) {
  }

  getAccessibleSites(): Observable<Site[]> {
    return this.http.get<Site[]>(this.API_URL + this.controller);
  }
}
