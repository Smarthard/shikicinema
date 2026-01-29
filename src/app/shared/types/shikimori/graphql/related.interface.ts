import { AnimeGQL } from '@app/shared/types/shikimori/graphql/anime.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface RelatedGQL {
    anime: AnimeGQL;
    id: ResourceIdType;
    manga: any;
    relationKind: string;
    relationText: string;
}
