export class DateUtil {

  static getDateFromISOString(isoDate: string): Date {
    return new Date(isoDate);
  }

  static getIsoStringFromDate(date: Date): string {
    return date.toISOString();
  }
}
