import { PosterGQL } from '@app/shared/types/shikimori/graphql/poster.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { TopicGQL } from '@app/shared/types/shikimori/graphql/topic.interface';

export interface CharacterGQL {
    id: ResourceIdType;
    createdAt: string;
    description: string;
    descriptionHtml: string;
    descriptionSource: string;
    isAnime: boolean;
    isManga: boolean;
    isRanobe: boolean;
    japanese: string;
    malId: ResourceIdType;
    name: string;
    poster: PosterGQL;
    russian: string;
    synonyms: string[];
    topic: TopicGQL;
    updatedAt: string;
    url: string;
}
