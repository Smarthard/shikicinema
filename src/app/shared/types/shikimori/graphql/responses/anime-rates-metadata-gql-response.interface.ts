import { AnimeGQL } from '@app/shared/types/shikimori/graphql/anime.interface';

export type AnimeRatesMetadataGQL = Pick<AnimeGQL,
    'id' |
    'name' |
    'russian' |
    'english' |
    'japanese' |
    'kind' |
    'rating' |
    'score' |
    'episodes' |
    'episodesAired' |
    'duration' |
    'airedOn' |
    'releasedOn' |
    'poster' |
    'genres' |
    'studios' |
    'videos' |
    'description'
>;

export interface AnimeRatesMetadataGQLResponse {
    data: {
        animes: AnimeRatesMetadataGQL[];
    }
}
