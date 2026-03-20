export interface ApiResponse<T> {
  returnData: T;
}

export interface ApiResponseWithPagination<T> {
  returnData: {
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
    items: T[];
  };
}

export interface PageOptions {
  page?: number;
  limit?: number;
}
