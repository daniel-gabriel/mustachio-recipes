/**
 * Timestamps for creation and update of an entity.
 */
export interface IAuditDates {
    /**
     * The date when the entity was created.
     */
    createdOn: Date;
    /**
     * The date when the entity was updated.
     */
    lastUpdatedOn: Date;
}
