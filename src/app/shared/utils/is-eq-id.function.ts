import { ResourceIdType } from '@app/shared/types/resource-id.type';

export function isEqId<T extends { id: ResourceIdType }>(a: T, b: T) {
    return a?.id === b?.id;
}
