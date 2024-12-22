import { ShikivideosKindType } from '@app/shared/types/shikicinema/v1';
import { VideoKindEnum } from '@app-root/app/modules/player/types';

export function mapVideoKindToShikicinema(kind: VideoKindEnum): ShikivideosKindType {
    switch (kind) {
        case VideoKindEnum.DUBBING:
            return 'озвучка';
        case VideoKindEnum.SUBTITLES:
            return 'субтитры';
        case VideoKindEnum.ORIGINAL:
            return 'оригинал';
        default:
            throw new Error(`Define map value for "${kind}"`);
    }
}
