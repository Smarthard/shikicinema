import { compareAsc } from 'date-fns';

import { FranchiseRelationEnum, ShikimoriFranchise } from '@app/shared/types/shikimori/anime-franchise.interface';


export function sortFranchise(itemA: ShikimoriFranchise, itemB: ShikimoriFranchise): number {
    switch (true) {
        case itemA.relation === FranchiseRelationEnum.PREQUEL:
            return 1;
        case itemB.relation === FranchiseRelationEnum.PREQUEL:
            return -1;
        case itemA.relation === FranchiseRelationEnum.SEQUEL:
            return -1;
        case itemB.relation === FranchiseRelationEnum.SEQUEL:
            return 1;
        default:
            return compareAsc(itemA.anime.aired_on, itemB.anime.aired_on);
    }
}
