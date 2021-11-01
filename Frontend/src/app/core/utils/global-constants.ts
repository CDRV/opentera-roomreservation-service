export class GlobalConstants {
  static protocol = 'https';
  static hostname = 'localhost';
  static port = 40075;
  static tsService = 'api/';
  static roomService = 'room/';
  static cookieValue = 'RoomReservationToken';
  static serviceKey = 'RoomReservationService';
  static version = '1.0';
  static organism = 'Centre de Recherche sur le Vieillissement de Sherbrooke - Regroupement INTER - ' + new Date().getFullYear();

  // Strings
  static requiredMessage = 'Ce champ est requis.';
}
