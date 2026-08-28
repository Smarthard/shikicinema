import { ResourceIdType } from '@app/shared/types';

export function getShikimoriAnimeLink(animeId: ResourceIdType): string {
    return `/animes/${animeId}?ignore302=1`;
}
