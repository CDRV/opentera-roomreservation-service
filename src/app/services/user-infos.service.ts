import {Injectable} from '@angular/core';
import {makeApiURL} from '@core/utils/make-api-url';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserInfos} from '@models/user-infos.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfosService {
  private API_URL = makeApiURL(true);
  private controller = 'userinfos';
  private userInfosSubject: BehaviorSubject<UserInfos> = new BehaviorSubject<UserInfos>(new UserInfos());

  constructor(private http: HttpClient) {
  }

  userInfos$(): Observable<UserInfos> {
    return this.userInfosSubject.asObservable();
  }

  getWithToken(idSite: number = null): Observable<UserInfos> {
    const siteFilter = idSite ? `?id_site=${idSite}` : '';
    return this.http.get<UserInfos>(this.API_URL + this.controller + siteFilter).pipe(
      tap(res => {
        this.userInfosSubject.next(res);
      }));
  }
}
