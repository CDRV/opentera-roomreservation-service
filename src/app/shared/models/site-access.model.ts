import {Site} from './site.model';

export class SiteAccess {
  id_site_access: number;
  id_site: number;
  id_user_group: number;
  site_access_role: string;
  site_name: string;
  site: Site;
}
