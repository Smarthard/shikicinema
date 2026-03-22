import { FranchiseRelationEnum, FranchiseRelationRussianEnum } from '@app/shared/types/shikimori';

export function getFranchiseRelation(relation: FranchiseRelationEnum | FranchiseRelationRussianEnum): string {
    switch (relation) {
        case FranchiseRelationRussianEnum.PREQUEL:
            return 'Приквел';
        case FranchiseRelationRussianEnum.SEQUEL:
            return 'Сиквел';
        case FranchiseRelationRussianEnum.SPINOFF:
            return 'Спинофф';
        case FranchiseRelationRussianEnum.PARENT_STORY:
            return 'Предыстория';
        case FranchiseRelationRussianEnum.ALT_VERSION:
            return 'Альт. История';
        case FranchiseRelationRussianEnum.SUMMARY:
            return 'Рекап';
        case FranchiseRelationRussianEnum.FRANCHISE:
            return 'Франшиза';
        default:
            return relation;
    }
}
