import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ParticipantService} from '../../services/participant.service';
import {Participant} from '../../core/models/participant.model';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-participant-selection',
  templateUrl: './participant-selection.component.html',
  styleUrls: ['./participant-selection.component.scss']
})
export class ParticipantSelectionComponent implements OnInit, OnChanges {
  @Output() selectedParticipantsChange = new EventEmitter();
  @Input() idProject: number;
  @Input() reservationParticipants: Participant[];
  refreshing = false;
  selectable = true;
  removable = true;
  addOnBlur = false;
  participantCtrl = new FormControl();
  participants: Participant[] = []; // List of participants from API
  selectedParticipants: Participant[] = []; // List of participants already assigned to the session
  filteredParticipants: Observable<Participant[]>; // Filtered list of the participants from API

  @ViewChild('participantInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private participantService: ParticipantService) {
    this.filteredParticipants = this.participantCtrl.valueChanges.pipe(
      startWith(null as string),
      map((filteringValue: string | null) => filteringValue ? this._filter(filteringValue) : this.participants.slice()));
  }

  ngOnInit(): void {
    this.getParticipants();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('pp', changes);
    if (changes.idProject) {
      this.selectedParticipants = [];
      this.selectedParticipantsChange.emit(this.selectedParticipants);
      this.refreshParticipants();
    }
    this.participantCtrl.setValue(null);
    if (this.reservationParticipants && this.reservationParticipants.length > 0
      && this.reservationParticipants[0].id_project === this.idProject) {
      this.selectedParticipants = this.reservationParticipants;
      this.participantCtrl.setValue(this.selectedParticipants);
    } else {
      this.selectedParticipants = [];
    }
  }

  private getParticipants() {
    this.participantService.participantsList$().subscribe(participants => {
      this.participants = participants ? participants : [];
    });
  }

  private refreshParticipants() {
    if (this.idProject) {
      this.refreshing = true;
      this.participantService.getByProject(this.idProject).subscribe(() => {
        this.refreshing = false;
      });
    }
  }

  remove(participant, index) {
    this.selectedParticipants.splice(index, 1);
    this.selectedParticipantsChange.emit(this.selectedParticipants);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const participant = event.option.value;
    const index = this.selectedParticipants.findIndex(p => p.id_participant === participant.id_participant);
    if (index === -1) {
      this.selectedParticipants.push(event.option.value);
      this.selectedParticipantsChange.emit(this.selectedParticipants);
    }
    this.fruitInput.nativeElement.value = '';
    this.participantCtrl.setValue(null);
  }

  private _filter(filterBy: any): Participant[] {
    if (filterBy) {
      filterBy = filterBy.toString().toLocaleLowerCase();
      return this.participants.filter((part: Participant) =>
        part.participant_name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    } else {
      return this.participants;
    }
  }
}
