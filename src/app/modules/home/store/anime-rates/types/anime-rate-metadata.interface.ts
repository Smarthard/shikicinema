import { AnimeRatesMetadataGQL } from '@app/shared/types/shikimori/graphql';
import { ResourceIdType } from '@app/shared/types';

export interface AnimeRatesMetadata {
    [animeId: ResourceIdType]: AnimeRatesMetadataGQL;
}
