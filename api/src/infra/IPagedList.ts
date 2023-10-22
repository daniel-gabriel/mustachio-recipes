export interface IPagedList<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
