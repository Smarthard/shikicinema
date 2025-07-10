import { PersonGQL } from '@app/shared/types/shikimori/graphql/person.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface PersonRoleGQL {
    id: ResourceIdType;
    person: PersonGQL;
    rolesEn: string[];
    rolesRu: string[];
}
