import { ResourceIdType } from '@app/shared/types/resource-id.type';

export function filterDuplicatedIds<T extends { id: ResourceIdType }>(item: T, pos: number, array: T[]) {
    return !pos || item.id !== array[pos - 1].id;
}
