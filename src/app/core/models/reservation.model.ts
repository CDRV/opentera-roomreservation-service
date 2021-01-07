import {Session} from './session.model';

export class Reservation {
  id_reservation: number;
  id_room: number;
  reservation_start_datetime: string | Date;
  reservation_end_datetime: string | Date;
  session_uuid: string;
  user_name: string;
  user_uuid: string;
  session: any;
}
