import { KODIK_UPLOADER } from '@app/shared/types/kodik/kodik-uploader.symbol';
import { KodikAnimeInfo, KodikApiResponse, KodikEpisodes } from '@app/shared/types/kodik';
import { VideoInfoInterface } from '@app/modules/player/types';
import { VideoMapperFn } from '@app/shared/types/video-mapper.type';
import { mapKodikKind } from '@app/shared/types/kodik/mappers/map-kodik-kind.function';


export const kodikVideoMapper: VideoMapperFn<KodikApiResponse<KodikAnimeInfo>> = ({ results }) => results.flatMap(
    ({ seasons, translation, quality, link }) => {
        const author = translation?.title || null;
        const kind = mapKodikKind(translation?.type);
        const uploader = KODIK_UPLOADER;

        if (seasons) {
            const episodes: VideoInfoInterface[] = [];
            const seasonIndex = Object.keys(seasons)?.[0];
            const episodesObj = seasons?.[seasonIndex]?.episodes || {} as KodikEpisodes;

            for (const [episode, url] of Object.entries(episodesObj)) {
                episodes.push({
                    quality,
                    author,
                    kind,
                    uploader,
                    url: 'https:' + url,
                    episode: Number(episode),
                    urlType: 'iframe',
                    language: 'ru',
                });
            }

            return episodes;
        } else {
            return {
                quality,
                author,
                kind,
                uploader,
                url: 'https:' + link,
                episode: 1,
                urlType: 'iframe',
                language: 'ru',
            };
        }
    },
);
