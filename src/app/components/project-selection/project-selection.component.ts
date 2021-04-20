import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ProjectService} from '@services/project.service';
import {Project} from '@models/project.model';

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
  selectedOption: Project;
  refreshing: boolean;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idSite) {
      this.refreshProjects();
      this.selectedProjectChange.emit(null);
    }
  }

  private getProjects() {
    this.projectService.projectsList$().subscribe((projects) => {
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
      this.selectedProjectChange.emit(selected.id_project);
    } else {
      this.selectedProjectChange.emit(null);
    }
  }

  private selectProject() {
    const alreadySelected = this.projects.find(p => p.id_project === this.idReservationProject);
    if (alreadySelected) {
      this.selectedOption = alreadySelected;
      this.selectedProjectChange.emit(alreadySelected.id_project);
    }
  }
}
