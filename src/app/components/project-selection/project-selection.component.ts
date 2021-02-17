import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../core/models/project.model';

@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.scss']
})
export class ProjectSelectionComponent implements OnInit, OnChanges {
  @Output() selectedProjectChange = new EventEmitter();
  @Input() idSite: number;
  @Input() idReservationProject: number;
  projects: Project[] = [];
  selectedOption: any;
  refreshing: boolean;
  private isInitialSetup: boolean;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.idSite) {
      this.refreshProjects();
    }
    if (changes.idReservationProject) {
      this.isInitialSetup = !!changes.idReservationProject.previousValue;
    }
  }

  private getProjects() {
    this.projectService.projectsList$().subscribe(projects => {
      this.projects = projects;
    });
  }

  private refreshProjects() {
    if (this.idSite) {
      this.refreshing = true;
      this.projectService.getBySite(this.idSite).subscribe(() => {
        this.selectProject();
        this.refreshing = false;
      });
    }
  }

  onValueChanged(event: any) {
    if (event.value) {
      const selected: Project = event.value;
      this.selectedProjectChange.emit(selected);
    } else {
      this.selectedProjectChange.emit(null);
    }
  }

  private selectProject() {
    const alreadySelected = this.projects.find(p => p.id_project === this.idReservationProject);
    console.log(this.projects, alreadySelected, this.idReservationProject);
    if (alreadySelected) {
      this.selectedOption = alreadySelected;
    }
  }
}
