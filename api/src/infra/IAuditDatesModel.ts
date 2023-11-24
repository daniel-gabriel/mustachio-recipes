/**
 * Audit dates interface. Used on db entities to mark them with having timestamps.
 */
export interface IAuditDatesModel {
    createdOn: Date;
    lastUpdatedOn: Date;
}
