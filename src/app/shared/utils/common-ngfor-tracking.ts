import { ResourceIdType } from '@app/shared/types/resource-id.type';

export function trackById<T extends { id?: ResourceIdType }>(index: number, item: T) {
    return item?.id || index;
}
