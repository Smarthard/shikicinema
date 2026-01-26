import { HttpParams } from '@angular/common/http';
import { PaginationRequest } from '@app/shared/types/shikimori/queries/pagination-request';

export function parsePagination<T extends PaginationRequest>(query: T): Required<PaginationRequest> {
    const page = query?.page || 1;
    const limit = query?.limit || 1000;

    return { limit, page };
}

export function setPaginationToParams<T extends PaginationRequest>(query: T, params = new HttpParams()) {
    const { limit, page } = parsePagination(query);

    return params
        .set('page', page)
        .set('limit', limit);
}
