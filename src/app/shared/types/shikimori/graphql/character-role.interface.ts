import { CharacterGQL } from '@app/shared/types/shikimori/graphql/character.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface CharacterRoleGQL {
    character: CharacterGQL;
    id: ResourceIdType;
    rolesEn: string[];
    rolesRu: string[];
}
