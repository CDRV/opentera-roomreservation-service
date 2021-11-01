import {Room} from '@shared/models/room.model';

export class Reservation {
  id_reservation?: number;
  id_room?: number;
  name?: string;
  reservation_start_datetime?: string | Date;
  reservation_end_datetime?: string | Date;
  session_uuid?: string;
  user_fullname?: string;
  user_uuid?: string;
  session_participant_uuids?: string[];
  session?: any;
  room?: Room;
}
