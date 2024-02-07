export interface IPagination {
    limit: number;
    offset: number;
}

export interface PaginatedResult<TItem> {
    items: TItem,
    total: number;
}
