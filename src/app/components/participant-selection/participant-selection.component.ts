import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ParticipantService} from '../../services/participant.service';
import {Participant} from '../../core/models/participant.model';

@Component({
  selector: 'app-participant-selection',
  templateUrl: './participant-selection.component.html',
  styleUrls: ['./participant-selection.component.scss']
})
export class ParticipantSelectionComponent implements OnInit, OnChanges {
  @Output() selectedParticipantChange = new EventEmitter();
  @Input() idSite: number;
  participants = [];
  selectedOption: any;

  constructor(private participantService: ParticipantService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getParticipants();
  }

  private getParticipants() {
    if (this.idSite) {
      this.participantService.getBySite(this.idSite);
      this.participantService.participantsList$().subscribe(participants => {
        this.participants = participants;
      });
    }
  }

  onValueChanged(event: any) {
    if (event.value) {
      const selected: Participant = event.value;
      this.selectedParticipantChange.emit(selected);
    } else {
      this.selectedParticipantChange.emit(null);
    }
  }

}
