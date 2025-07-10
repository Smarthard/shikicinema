import { IncompleteDateGQL } from '@app/shared/types/shikimori/graphql/incomplete-date.interface';
import { PosterGQL } from '@app/shared/types/shikimori/graphql/poster.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { TopicGQL } from '@app/shared/types/shikimori/graphql/topic.interface';

export interface PersonGQL {
    id: ResourceIdType;
    birthOn: IncompleteDateGQL;
    createdAt: string;
    deceasedOn: IncompleteDateGQL;
    isMangaka: boolean;
    isProducer: boolean;
    isSeyu: boolean;
    japanese: string;
    malId: ResourceIdType;
    name: string;
    poster: PosterGQL;
    russian: string;
    synonyms: string[];
    topic: TopicGQL;
    updatedAt: string;
    url: string;
    website: string;
}
