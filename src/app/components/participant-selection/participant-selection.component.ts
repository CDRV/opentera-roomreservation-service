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
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-participant-selection',
  templateUrl: './participant-selection.component.html',
  styleUrls: ['./participant-selection.component.scss']
})
export class ParticipantSelectionComponent implements OnInit, OnChanges {
  @Output() selectedParticipantsChange = new EventEmitter();
  @Input() idProject: number;
  @Input() reservationParticipants: Participant[];
  selectedOption: any;
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
    if (changes.idProject) {
      this.refreshParticipants();
    }
    if (changes.reservationParticipants) {
      this.participantCtrl.setValue(null);
      this.selectedParticipants = !this.reservationParticipants ? [] : this.reservationParticipants;
    }
  }

  private getParticipants() {
    this.participantService.participantsList$().subscribe(participants => {
      this.participants = participants;
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
    console.log(filterBy);
    if (filterBy) {
      filterBy = filterBy.toString().toLocaleLowerCase();
      return this.participants.filter((part: Participant) =>
        part.participant_name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    } else {
      return this.participants;
    }
  }
}
