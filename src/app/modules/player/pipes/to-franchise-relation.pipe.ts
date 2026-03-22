import { Pipe, PipeTransform } from '@angular/core';

import { FranchiseRelationEnum, FranchiseRelationRussianEnum } from '@app/shared/types/shikimori';
import { getFranchiseRelation } from '@app/modules/player/utils';


@Pipe({
    name: 'toFranchiseRelation',
    standalone: true,
})
export class ToFranchiseRelationPipe implements PipeTransform {
    transform(relation: FranchiseRelationEnum | FranchiseRelationRussianEnum): string {
        return getFranchiseRelation(relation);
    }
}
