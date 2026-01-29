import { ResourceIdType } from '@app/shared/types';

export function entityArrayToMap<T extends { id: ResourceIdType }>(entities: T[]) {
    const json = {};

    for (const entity of entities) {
        json[entity.id] = entity;
    }

    return json;
}

export function entityMapToArray<T>(entities: { [id: ResourceIdType]: T }): T[] {
    return Object.values(entities || {})?.map((val) => val) || [];
}
