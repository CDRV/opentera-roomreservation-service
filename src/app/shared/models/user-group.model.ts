
import {User} from './user.model';
import {SiteAccess} from './site-access.model';
import {ProjectAccess} from './project-access.model';

export class UserGroup {
  id_user_group: number;
  user_group_name: string;
  user_group_users: User[];
  user_group_sites_access: SiteAccess[];
  user_group_projects_access: ProjectAccess[];
}
