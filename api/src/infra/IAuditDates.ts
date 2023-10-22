/**
 * Audit dates interface. Used on db entities to mark them with having timestamps.
 */
export interface IAuditDates {
    createdOn: Date;
    lastUpdatedOn: Date;
}
