import {Injectable} from '@angular/core';
import {makeApiURL} from '../core/utils/make-api-url';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Project} from '../core/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private API_URL = makeApiURL(false);
  private controller = 'user/projects';

  private projectsList: Project[] = [];
  private projectsListSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  constructor(private http: HttpClient) {
  }

  projectsList$(): Observable<Project[]> {
    return this.projectsListSubject.asObservable();
  }

  getBySite(idSite: number): Observable<Project[]> {
    return this.http.get<Project[]>(this.API_URL + this.controller + '?id_site=' + idSite).pipe(
      tap(result => {
        this.projectsList = result;
        this.projectsListSubject.next(this.projectsList);
      }));
  }
}
