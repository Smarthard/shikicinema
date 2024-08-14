/* eslint-disable camelcase */
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export function toUserRatesUpdate({
    chapters,
    volumes,
    text,
    created_at,
    updated_at,
    text_html,
    ...userRate
}: UserAnimeRate): Partial<UserAnimeRate> {
    return {
        // разыменовать с дефолтными значениями нельзя
        // т.к. значение полей заморожено
        chapters: chapters ?? 0,
        volumes: volumes ?? 0,
        text: text ?? '',
        ...userRate,
    };
}
