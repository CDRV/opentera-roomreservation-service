import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ProjectService} from '@services/project.service';
import {Project} from '@shared/models/project.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SelectedSiteService} from '@services/selected-site.service';
import {Subscription} from 'rxjs';
import {SelectedProjectService} from '@services/selected-project.service';
import {PermissionsService} from '@services/permissions.service';
import {GlobalConstants} from '@core/utils/global-constants';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() idReservationProject: number;
  @Input() form: FormGroup;
  @Input() required = false;
  projects: Project[] = [];
  selectedOption: Project;
  refreshing: boolean;
  requiredMessage = GlobalConstants.requiredMessage;
  private subscription: Subscription;

  constructor(private projectService: ProjectService,
              private permissionsService: PermissionsService,
              private selectedSiteService: SelectedSiteService,
              private selectedProjectService: SelectedProjectService) {
  }

  ngOnInit(): void {
    this.form.addControl('project', new FormControl(''));
    this.getProjects();
    this.getSelectedSite();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.controls.project) {
      this.required ? this.form.controls.project.setValidators([Validators.required]) : this.form.controls.project.clearValidators();
    }
    this.selectProject();
  }

  private getSelectedSite(): void {
    this.subscription = this.selectedSiteService.getSelectedSite().subscribe((site) => {
      this.refreshProjects(site.id_site);
    });
  }

  private refreshProjects(idSite: number): void {
    if (idSite) {
      this.projectService.getBySite(idSite).subscribe(() => {
        this.selectProject();
      });
    }
  }

  private getProjects(): void {
    this.projectService.projectsList$().subscribe((projects) => {
      this.projects = projects;
      this.selectProject();
    });
  }

  private selectProject(): void {
    const alreadySelected = this.projects.find(p => p.id_project === this.idReservationProject);
    if (alreadySelected) {
      this.selectedOption = alreadySelected;
      this.onValueChanged(alreadySelected);
    }
  }

  onValueChanged(selected: Project): void {
    this.form.controls.project.setValue(selected);
    this.selectedProjectService.setSelectedProject(selected);
    this.getProjectRole(selected);
  }

  private getProjectRole(project: Project): void {
    this.permissionsService.getProjectPermission(project.id_project).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
