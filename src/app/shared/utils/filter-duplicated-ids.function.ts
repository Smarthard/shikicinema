import { ResourceIdType } from '@app/shared/types/resource-id.type';

const defaultExtractIdFn = (item: any) => item.id;

export function filterDuplicatedIds<T>(extractId: (item: T) => ResourceIdType = defaultExtractIdFn) {
    return function(item: T, pos: number, array: T[]) {
        return !pos || extractId(item) !== extractId(array[pos - 1]);
    }
}
