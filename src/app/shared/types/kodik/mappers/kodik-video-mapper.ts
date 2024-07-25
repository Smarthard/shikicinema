import { KODIK_UPLOADER } from '@app/shared/types/kodik/kodik-uploader.symbol';
import { KodikAnimeInfo, KodikApiResponse, KodikEpisodes } from '@app/shared/types/kodik';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoMapperFn } from '@app/shared/types/video-mapper.type';
import { mapKodikKind } from '@app/shared/types/kodik/mappers/map-kodik-kind.function';


export const kodikVideoMapper: VideoMapperFn<KodikApiResponse<KodikAnimeInfo>> = ({ results }) => results.flatMap(
    ({ seasons, translation, quality }) => {
        if (seasons) {
            const episodes: VideoInfoInterface[] = [];
            const seasonIndex = Object.keys(seasons)?.[0];
            const episodesObj = seasons?.[seasonIndex]?.episodes || {} as KodikEpisodes;

            for (const [episode, url] of Object.entries(episodesObj)) {
                episodes.push({
                    quality,
                    url: 'https:' + url,
                    episode: Number(episode),
                    author: translation?.title || null,
                    kind: mapKodikKind(translation?.type),
                    uploader: KODIK_UPLOADER,
                    urlType: 'iframe',
                    language: 'ru',
                });
            }

            return episodes;
        } else {
            return results.map(({ link: url }) => ({
                quality,
                url: 'https:' + url,
                episode: 1,
                author: translation?.title || null,
                kind: mapKodikKind(translation?.type),
                uploader: KODIK_UPLOADER,
                urlType: 'iframe',
                language: 'ru',
            }));
        }
    },
);
