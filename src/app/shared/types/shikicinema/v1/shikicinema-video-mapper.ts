
import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1/shikivideos.interface';
import { VideoMapperFn } from '@app/shared/types/video-mapper.type';

export const shikicinemaVideoMapper: VideoMapperFn<ShikivideosInterface> = ({
    id,
    url,
    kind,
    author,
    episode,
    quality,
    language,
    uploader,
}) => ({
    id, url, language, quality, uploader, episode, author, kind,
    urlType: 'iframe',
});
