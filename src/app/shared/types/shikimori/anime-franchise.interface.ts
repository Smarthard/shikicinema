import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';

export enum FranchiseRelationEnum {
    PREQUEL = 'Prequel',
    SEQUEL = 'Sequel',
    SPINOFF = 'Spin-off',
    PARENT_STORY = 'Parent Story',
    SIDE_STORY = 'Side Story',
    ALT_VERSION = 'Alternative Version',
    OTHER = 'Other',
    SUMMARY = 'Summary',
    CHARACTER = 'Character',
    FRANCHISE = 'Franchise',

    /* только для МАНГИ */
    ADAPTATION = 'Adaptation',
}

export enum FranchiseRelationRussianEnum {
    PREQUEL = 'Предыстория',
    SEQUEL = 'Продолжение',
    SPINOFF = 'Ответвление от оригинала',
    PARENT_STORY = 'Изначальная история',
    SIDE_STORY = 'Другая история',
    ALT_VERSION = 'Альтернативная история',
    OTHER = 'Прочее',
    SUMMARY = 'Обобщение',
    CHARACTER = 'Общий персонаж',
    FRANCHISE = 'Развёрнутая история',

    /* только для МАНГИ */
    ADAPTATION = 'Адаптация',
}

export type AnimeFranchiseItem = Omit<
    AnimeBriefInfoInterface,
    'english' | 'japanese' | 'synonyms' | 'user_rate' | 'next_episode_at'
>;

export interface ShikimoriFranchise {
    relation: FranchiseRelationEnum;
    relation_russian: FranchiseRelationRussianEnum;
    anime: AnimeFranchiseItem;

    /* тут приходит что-то и исключает поле anime и наоборот, но нам это не особо нужно пока */
    manga: never;
}
