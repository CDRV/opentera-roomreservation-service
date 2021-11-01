import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {SessionTypeService} from '@services/session-type.service';
import {SessionType} from '@shared/models/session-type.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalConstants} from '@core/utils/global-constants';
import {Subscription} from 'rxjs';
import {SelectedProjectService} from '@services/selected-project.service';
import {filter, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-session-type-selector',
  templateUrl: './session-type-selector.component.html',
  styleUrls: ['./session-type-selector.component.scss']
})
export class SessionTypeSelectorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() idEventSessionType: number;
  @Input() form: FormGroup;
  @Input() required = false;
  types: SessionType[] = [];
  selectedType: SessionType;
  requiredMessage = GlobalConstants.requiredMessage;
  private subscription: Subscription;

  constructor(private selectedProjectService: SelectedProjectService,
              private typeService: SessionTypeService) {
  }

  ngOnInit(): void {
    this.form.addControl('type', new FormControl(''));
    this.getTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectType();
    if (this.form.controls.type) {
      this.required ? this.form.controls.type.setValidators([Validators.required]) : this.form.controls.type.clearValidators();
    }
  }

  private getTypes(): void {
    this.subscription = this.selectedProjectService.getSelectedProject().pipe(
      filter((project) => !!(project && project.id_project)),
      switchMap((project) => {
        return this.typeService.getByProject(project.id_project);
      })
    ).subscribe((types) => {
      this.types = types;
      this.selectType();
    });
  }

  private selectType(): void {
    const alreadySelected = this.types.find(p => p.id_session_type === this.idEventSessionType);
    if (alreadySelected) {
      this.form.controls.type.setValue(alreadySelected);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
