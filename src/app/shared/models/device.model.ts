import {DeviceSubtype} from './device-subtype.model';

export class Device {
  device_config: any;
  device_enabled: boolean;
  device_lastonline: Date;
  device_name: string;
  device_notes: null;
  device_onlineable: boolean;
  device_optional: boolean;
  device_type: number;
  device_uuid: string;
  id_device: number;
  id_device_subtype: number;
  device_subtype: DeviceSubtype;
}
