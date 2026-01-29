import { ResourceIdType } from '@app/shared/types/resource-id.type';

export function trackById<T extends { id?: ResourceIdType }>(index: number, item: T) {
    if (item?.id && `${item.id}` !== '-1') {
        return item.id;
    } else {
        return index;
    }
}
