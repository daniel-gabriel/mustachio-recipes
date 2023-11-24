/**
 * A generic paged list. The items in the data array are expected to be of type `TItem`.
 */
export interface IPagedList<TItem> {
    /**
     * The array containing one page of data.
     */
    data: TItem[];
    /**
     * The index of the returned page, 0-based.
     */
    pageIndex: number;
    /**
     * The page size.
     */
    pageSize: number;
    /**
     * The total number of items across all pages.
     */
    totalItems: number;
    /**
     * The total number of pages.
     */
    totalPages: number;
}
