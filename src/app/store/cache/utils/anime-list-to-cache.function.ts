import { AnimeCacheEntity } from '@app/store/cache/types/anime-cache-entity.interface';
import { AnimeCacheType } from '@app/store/cache/types/anime-cache.type';

export function animeCacheEntitiesToCache(animes: AnimeCacheEntity[] = []): AnimeCacheType {
    const cache: AnimeCacheType = {};

    for (const { anime, ttl } of animes) {
        cache[anime.id] = { anime, ttl };
    }

    return cache;
}
