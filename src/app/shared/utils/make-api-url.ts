import {GlobalConstants} from './global-constants';

export function makeApiURL(forRoomService = false) {
  const url = GlobalConstants.protocol + '://' + GlobalConstants.hostname + ':' + GlobalConstants.port + '/';
  if (forRoomService) {
    return url + GlobalConstants.roomService + GlobalConstants.tsService;
  } else {
    return url + GlobalConstants.tsService;
  }
}
