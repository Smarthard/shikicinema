import { KodikQualitiesEnum } from '@app/shared/types/kodik/kodik-qualities.enum';
import { KodikSeasons } from '@app/shared/types/kodik/kodik-seasons.interface';
import { KodikTranslationInterface } from '@app/shared/types/kodik/kodik-translation.interface';
import { KodikTypesEnum } from '@app/shared/types/kodik/kodik-types.enum';


export interface KodikAnimeInfo {
    /** e.g. "serial-6242" */
    id: string;

    /** tbh. only animes are useful */
    type: KodikTypesEnum;

    /** e.g. '//kodik.info/serial/6242/8bc954426b7203e1d2e781cca0f4141d/720p' */
    link: string;

    /** e.g. 'Ковбой Бибоп' */
    title: string;

    /** e.g. 'Cowboy Bebop' */
    title_orig: string;

    /** e.g. 'Kaubôi bibappu' */
    other_title: string;

    /** Anime's author and kind */
    translation: KodikTranslationInterface;

    /** e.g. 1998 */
    year: number;

    /** e.g. 1 */
    last_season: number;

    /** e.g. 26 */
    last_episode: number;

    /** e.g. 26 */
    episodes_count: 26;

    /** e.g. '229653' */
    kinopoisk_id: string;

    /** e.g. 'tt0213338' */
    imdb_id: string;

    /** e.g. 'http://www.world-art.ru/animation/animation.php?id=26' */
    worldart_link: string;

    /** e.g. '1' */
    shikimori_id: string;

    /** e.g. 'BDRip 720p' */
    quality: KodikQualitiesEnum;

    /** is very low quality */
    camrip: boolean;

    /** is lgbt */
    lgbt: boolean;

    /** ISO datetime string */
    created_at: string;

    /** ISO datetime string */
    updated_at: string;

    /** e.g. ['https://i.kodik.biz/screenshots/seria/166920/1.jpg'] */
    screenshots: string[];

    seasons: KodikSeasons;
}
