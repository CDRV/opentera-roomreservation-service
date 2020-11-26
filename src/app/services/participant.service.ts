import {Injectable} from '@angular/core';
import {makeApiURL} from '../core/utils/make-api-url';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Participant} from '../core/models/participant.model';

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

  participantsList$(): Observable<Participant[]> {
    return this.participantsListSubject.asObservable();
  }

  getBySite(idSite: number) {
    this.http.get<Participant[]>(this.API_URL + this.controller + '?id_site=' + idSite).subscribe(result => {
      this.participantsList = result;
      this.participantsListSubject.next(this.participantsList);
    });
  }
}
