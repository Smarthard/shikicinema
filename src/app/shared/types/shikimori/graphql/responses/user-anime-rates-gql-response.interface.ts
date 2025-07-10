import { UserAnimeRateGQL } from '@app/shared/types/shikimori/graphql/user-anime-rate-gql.interface';

export interface UserAnimeRatesGQLResponse {
    data: {
        userRates: UserAnimeRateGQL[];
    }
}
