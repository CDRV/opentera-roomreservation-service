import {Project} from './project.model';

export class ProjectAccess {
  id_project: number;
  id_user_group: number;
  project_access_role: string;
  project_name: string;
  site_name: string;
  id_user: number;
  project: Project;
}
