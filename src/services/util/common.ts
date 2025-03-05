export interface PaginatedResult<T> {
    page: number;
    pageSize: number;
    totalRecords: number;
    items: T[];
}