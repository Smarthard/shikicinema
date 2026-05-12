import { FranchiseRelationEnum } from '@app/shared/types/shikimori/anime-franchise.interface';

export function franchiseRelationI18N(relation: FranchiseRelationEnum): string {
    return relation?.toLocaleUpperCase()?.replace(/\s+/, '_');
}
