import { DateUtils } from '../../src/utils/DateUtils';

describe('DateUtils', () => {
    let baseDate: Date;
    let earlierDate: Date;
    let laterDate: Date;

    beforeEach(() => {
        baseDate = new Date(2024, 0, 15); // January 15, 2024
        earlierDate = new Date(2024, 0, 10); // January 10, 2024
        laterDate = new Date(2024, 0, 20); // January 20, 2024
    });

    it('isDateBetween_dateWithinRange_returnsTrue', () => {
        expect(DateUtils.isDateBetween(new Date(2024, 0, 12), earlierDate, laterDate)).toBe(true);
    });

    it('isDateBetween_dateOutsideRange_returnsFalse', () => {
        expect(DateUtils.isDateBetween(new Date(2024, 0, 25), earlierDate, laterDate)).toBe(false);
    });

    it('isDateBetween_sameStartAndEndDate_returnsFalse', () => {
        expect(DateUtils.isDateBetween(new Date(2024, 0, 10), earlierDate, earlierDate)).toBe(false);
    });

    it('isDateBetween_unorderedStartAndEndDate_returnsTrue', () => {
        expect(DateUtils.isDateBetween(new Date(2024, 0, 12), laterDate, earlierDate)).toBe(true);
    });

    it('addWeekToDate_addsOneWeek_returnsNewDate', () => {
        DateUtils.addWeekToDate(undefined as unknown as Date);
        const newDate = DateUtils.addWeekToDate(baseDate);
        expect(newDate).toEqual(new Date(2024, 0, 22));
    });

    it('addWeekToDate_originalDateUnmodified_verifiesOriginalDate', () => {
        const originalDateCopy = new Date(baseDate);
        DateUtils.addWeekToDate(baseDate);
        expect(baseDate).toEqual(originalDateCopy);
    });
});
