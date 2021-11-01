import {Injectable} from '@angular/core';
import {makeApiURL} from '@core/utils/make-api-url';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Participant} from '@shared/models/participant.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private API_URL = makeApiURL();
  private controller = 'user/participants';

  private participantsList: Participant[] = [];
  private participantsListSubject: BehaviorSubject<Participant[]> = new BehaviorSubject<Participant[]>([]);

  constructor(private http: HttpClient) {
  }

  participants$(): Observable<Participant[]> {
    return this.participantsListSubject.asObservable();
  }

  getByProject(idProject: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(this.API_URL + this.controller + '?enabled=true&id_project=' + idProject).pipe(
      tap(result => {
        this.participantsList = result;
        this.participantsListSubject.next(this.participantsList);
      })
    );
  }
}
