import { compareAsc } from 'date-fns';

export function filterByTtl<T extends { ttl: string }>(entities: T[] = []): T[] {
    const now = Date();

    return entities.filter(({ ttl }) => compareAsc(ttl, now) > 0);
}
