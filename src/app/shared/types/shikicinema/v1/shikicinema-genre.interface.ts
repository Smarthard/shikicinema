import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikicinemaGenreKindEnum } from '@app/shared/types/shikicinema/v1/shikicinema-genre-kind.enum';

export interface ShikicinemaGenre {
    id: ResourceIdType;
    name: string;
    russian: string;
    kind: ShikicinemaGenreKindEnum;
}
