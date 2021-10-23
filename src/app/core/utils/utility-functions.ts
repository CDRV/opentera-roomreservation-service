import {Account} from '@shared/models/account.model';

export function dateToISOLikeButLocal(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  return iso.slice(0, 19);
}

export function setDate(date: Date, time: Date): Date {
  date.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return date;
}

export function getDuration(startTime: Date, endTime: Date): number {
  const diffMs = endTime.getTime() - startTime.getTime();
  return Math.floor(diffMs / 60000);
}

export function isObjectEmpty(object: any): boolean {
  return !object || !Object.keys(object).length;
}

export function isUser(account: Account): boolean {
  return account.login_type === 'user';
}

export function  roundToNearestQuarter(date: Date): Date {
  const coefficient = 1000 * 60 * 15;
  return new Date(Math.round(date.getTime() / coefficient) * coefficient);
}
