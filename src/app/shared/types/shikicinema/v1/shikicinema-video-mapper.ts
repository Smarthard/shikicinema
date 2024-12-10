
import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1/shikivideos.interface';
import { ShikivideosKindType } from '@app/shared/types/shikicinema/v1/shikivideos-kind.type';
import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';
import { VideoMapperFn } from '@app/shared/types/video-mapper.type';
import { VideoQualityEnum } from '@app/modules/player/types';

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
    ({ kind, uploader, quality, ...others }) => ({
        ...others,
        kind: mapShikicinemaKindToCommon(kind),
        urlType: 'iframe',
        quality: quality.toLocaleLowerCase() as VideoQualityEnum,
        uploader: uploader as UploaderIdType,
    }),
);
