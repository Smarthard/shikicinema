
import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1/shikivideos.interface';
import { ShikivideosKindType } from '@app/shared/types/shikicinema/v1/shikivideos-kind.type';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { VideoMapperFn } from '@app/shared/types/video-mapper.type';

function mapShikicinemaKindToCommon(kind: ShikivideosKindType): VideoKindEnum {
    switch (kind) {
        case 'озвучка':
            return VideoKindEnum.DUBBING;
        case 'субтитры':
            return VideoKindEnum.SUBTITLES;
        case 'оригинал':
            return VideoKindEnum.ORIGINAL;
        default:
            throw new Error('Unknown video kind type!');
    }
}

export const shikicinemaVideoMapper: VideoMapperFn<ShikivideosInterface[]> = (videos) => videos?.map(
    ({ kind, ...others }) => ({
        ...others,
        kind: mapShikicinemaKindToCommon(kind),
        urlType: 'iframe',
    }),
);
