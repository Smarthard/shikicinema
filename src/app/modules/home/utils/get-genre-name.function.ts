import { ShikicinemaGenre } from '@app/shared/types/shikicinema/v1';

export function getGenreName(genre: ShikicinemaGenre, currentLang = 'ru') {
    return currentLang === 'ru' ? genre?.russian ?? genre.name : genre.name;
}
