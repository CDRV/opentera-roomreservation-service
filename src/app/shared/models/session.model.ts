import {Device} from './device.model';
import {Participant} from './participant.model';
import {User} from './user.model';

export class Session {
  id_session: number;
  session_uuid: string;
  id_session_type: number;
  id_creator_user: number;
  id_creator_device: number;
  id_creator_participant: number;
  id_creator_service: number;

  session_name: string;
  session_start_datetime: Date | string;
  session_duration: number;
  session_status: number;
  session_comments: string;
  session_parameters: string;
  session_participants: Participant[];
  session_users: User[];
  session_devices: Device[];

  session_participants_uuids: string[];
  session_users_uuids: string[];
}
