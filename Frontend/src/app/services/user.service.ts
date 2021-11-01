import { Injectable } from '@angular/core';
import {makeApiURL} from '@core/utils/make-api-url';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '@shared/models/user.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = makeApiURL();
  private controller = 'user/users';

  private usersList: User[] = [];
  private usersListSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {
  }

  users$(): Observable<User[]> {
    return this.usersListSubject.asObservable();
  }

  getBySite(idSite: number): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL + this.controller + '?id_site=' + idSite).pipe(
      tap(result => {
        this.usersList = result;
        this.usersListSubject.next(this.usersList);
      }));
  }
}
