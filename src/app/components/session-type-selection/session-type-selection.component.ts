import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SessionTypeService} from '../../services/session-type.service';
import {SessionType} from '../../core/models/session-type.model';

@Component({
  selector: 'app-session-type-selection',
  templateUrl: './session-type-selection.component.html',
  styleUrls: ['./session-type-selection.component.scss']
})
export class SessionTypeSelectionComponent implements OnInit, OnChanges {
  @Output() selectedSessionTypeChange = new EventEmitter();
  @Input() idProject: number;
  @Input() idSessionType: number;
  sessionTypes: SessionType[] = [];
  selectedOption: SessionType;
  refreshing = false;

  constructor(private sessionTypeService: SessionTypeService) {
  }

  ngOnInit(): void {
    this.getSessionTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idProject) {
      this.refreshSessionTypes();
    }
    if (changes.idSessionType) {
      this.selectSessionType();
    }
  }

  private getSessionTypes() {
    this.sessionTypeService.sessionTypesList$().subscribe((sessionTypes) => {
      this.sessionTypes = sessionTypes;
    });
  }

  private refreshSessionTypes() {
    if (this.idProject) {
      this.refreshing = true;
      this.sessionTypeService.getByProject(this.idProject).subscribe(() => {
        this.refreshing = false;
      });
    }
  }

  onValueChanged(event: any) {
    if (event.value) {
      const selected: SessionType = event.value;
      this.selectedSessionTypeChange.emit(selected);
    } else {
      this.selectedSessionTypeChange.emit(null);
    }
  }

  private selectSessionType() {
    const alreadySelected = this.sessionTypes.find(p => p.id_session_type === this.idSessionType);
    if (alreadySelected) {
      this.selectedOption = alreadySelected;
    }
  }
}
