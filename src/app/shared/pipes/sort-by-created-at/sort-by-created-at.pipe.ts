import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortByCreatedAt',
    standalone: true,
})
export class SortByCreatedAtPipe implements PipeTransform {
    transform<T extends { created_at?: string }>(entities: T[] = [], isAsc = true): T[] {
        return [...entities].sort((a, b) => isAsc
            ? Date.parse(b?.created_at) - Date.parse(a?.created_at)
            : Date.parse(a?.created_at) - Date.parse(b?.created_at));
    }
}
