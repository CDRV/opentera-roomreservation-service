import {Site} from './site.model';
import {Session} from './session.model';

export class Room {
  id_room?: number;
  id_site?: number;
  room_name?: string;
  room_site?: Site;
  room_sessions?: Session[];
  site?: Site;
}
