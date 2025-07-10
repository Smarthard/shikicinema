import { AnimeRate, UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import {
    AnimeRatesMetadataGQL,
    AnimeRatesMetadataGQLResponse,
    UserAnimeRateGQL,
    UserAnimeRatesGQLResponse,
} from '@app/shared/types/shikimori/graphql';
import { ResourceIdType } from '@app/shared/types';
import { UserAnimeRatesQuery } from '@app/shared/types/shikimori/queries';
import { UserRateTargetEnum } from '@app/shared/types/shikimori/user-rate-target.enum';

export function mapUserRatesGQLQuery(query: UserAnimeRatesQuery) {
    const {
        page,
        limit,
        status,
    } = query;

    return `
        {
            userRates(
                page: ${page},
                limit: ${limit},
                status: ${status},
                targetType: Anime,
            ) {
                id
                score
                status
                text
                episodes
                chapters
                volumes
                text
                rewatches
                createdAt
                updatedAt
                anime {
                    id
                    name
                    russian
                    url
                    score
                    airedOn { date }
                    releasedOn { date }
                    kind
                    status
                }
            }
        }
    `.replace(/\n/g, '');
}

export function mapAnimeRatesMetadataGQLQuery(animeIds: ResourceIdType[]) {
    return `
        {
            animes(ids: "${animeIds.join(',')}", limit: 50, censored: false) {
                id
                name
                russian
                english
                japanese
                kind
                rating
                score
                airedOn { date }
                releasedOn { date }
                genres { id name }
                studios { id name }
            }
        }
    `.replace(/\n/g, '');
}

export function mapGqlToV2UserAnimeRate(animeUserRateGQL: UserAnimeRateGQL): UserAnimeRate {
    const {
        id,
        status,
        anime,
        score,
        createdAt,
        episodes,
        rewatches,
        text,
        chapters,
        updatedAt,
    } = animeUserRateGQL;

    return {
        id,
        status,
        chapters,
        score,
        episodes,
        rewatches,
        text,
        anime: {
            id: anime.id,
            name: anime.name,
            russian: anime.russian,
            url: anime.url,
            score: `${anime.score}`,
            aired_on: anime.airedOn.date,
            released_on: anime.releasedOn.date,
            kind: anime.kind,
            status: anime.status,
            episodes: anime.episodes,
            episodes_aired: anime.episodesAired,
        } as AnimeRate,
        created_at: createdAt,
        target_id: anime.id,
        target_type: UserRateTargetEnum.ANIME,
        text_html: text,
        updated_at: updatedAt,
        user_id: null,
        volumes: null,
    };
}

export function mapUserAnimeRatesGQL(response: UserAnimeRatesGQLResponse): UserAnimeRate[] {
    return response?.data?.userRates?.map(mapGqlToV2UserAnimeRate);
}

export function mapAnimeRatesMetadataGQL(response: AnimeRatesMetadataGQLResponse): AnimeRatesMetadataGQL[] {
    return response?.data?.animes;
}
