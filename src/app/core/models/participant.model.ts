import {Group} from './group.model';
import {Site} from './site.model';
import {Project} from './project.model';
import {Device} from './device.model';

export class Participant {
  id_participant: number;
  id_participant_group: number;
  id_project: number;
  id_site: number;
  participant_enabled: boolean;
  participant_lastonline: Date;
  participant_name: string;
  participant_uuid: string;
  participant_username: string;
  participant_email: string;
  participant_password: string;
  participant_token: string;
  participant_login_enabled: boolean;
  participant_participant_group: Group;
  participant_project: Project;
  participant_desks: Device[];
  site: Site;
}
