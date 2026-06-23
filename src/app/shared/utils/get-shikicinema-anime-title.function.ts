import { ShikicinemaAnimeTitle } from '@app/shared/types/shikicinema/v1/shikicinema-anime-title.interface';

export function getShikicinemaAnimeTitle(titles: ShikicinemaAnimeTitle[], language: string): string {
    const allInLanguage = titles
        ?.filter((title) => title.language === language)
        ?.sort((a, b) => a.priority - b.priority) || [];

    return allInLanguage?.at(0)?.title || '';
}
