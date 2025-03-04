/**
 * Class providing date utilities.
 */
export class DateUtils {
    /**
     * Checks if a date is between two given dates. The order of the start and end dates does not matter.
     * @param dateToCheck The date to check.
     * @param date1 The first date of the range.
     * @param date2 The second date of the range.
     * @returns `true` if the date is within the range, otherwise `false`.
     */
    public static isDateBetween(dateToCheck: Date, date1: Date, date2: Date): boolean {
        let startDate = date1 < date2 ? date1 : date2;
        let endDate = date1 > date2 ? date1 : date2;
        return dateToCheck > startDate && dateToCheck < endDate;
    }

    /**
     * Adds one week to a given date.
     * @param date The date to add a week to.
     * @returns A new `Date` object, one week later than the input date.
     */
    public static addWeekToDate(date: Date): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 7);
        return newDate;
    }
}