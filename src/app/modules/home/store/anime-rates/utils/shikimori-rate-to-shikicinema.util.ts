import { ShikicinemaAnimeUserRate } from '@app/shared/types/shikicinema/v1';
import { UserAnimeRate } from '@app/shared/types/shikimori';

export function shikimoriRateToShikicinema({
    anime,
    score,
    created_at: created,
    updated_at: updated }: UserAnimeRate,
): ShikicinemaAnimeUserRate {
    return {
        id: anime.id as number,
        score,
        created,
        updated,
    };
}
