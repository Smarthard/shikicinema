import { DELETED_UPLOADER, KODIK_UPLOADER } from '@app/shared/types/well-known-uploader-ids';
import { WellKnownType } from '@app/shared/types/well-known-uploaders.type';


export const WELL_KNOWN_UPLOADERS_MAP = {
    [KODIK_UPLOADER]: {
        id: KODIK_UPLOADER,
        name: 'GLOBAL.VIDEO.WELL_KNOWN_UPLOADERS.KODIK',
        avatar: '/assets/kodik.png',
        url: 'mailto:support@kodik.biz',
    },

    [DELETED_UPLOADER]: {
        id: DELETED_UPLOADER,
        name: 'GLOBAL.VIDEO.WELL_KNOWN_UPLOADERS.DELETED_UPLOADER',
        avatar: 'https://shikimori.one/assets/globals/missing.jpg',
    },
} as WellKnownType;
