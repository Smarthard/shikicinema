import { KodikQualitiesEnum } from '@app/shared/types/kodik';
import { VideoQualityEnum } from '@app/modules/player/types';

export function mapKodikQuality(kodikQuality: KodikQualitiesEnum): VideoQualityEnum {
    switch (kodikQuality) {
        case 'BDRip':
        case 'BDRip 720p':
        case 'BDRip 1080p':
            return VideoQualityEnum.BD;
        case 'DVDRip':
        case 'DVDSrc':
        case 'HDDVDRip':
        case 'HDDVDRip 1080p':
        case 'HDDVDRip 720p':
            return VideoQualityEnum.DVD;
        case 'WEB-DLRip':
        case 'WEB-DLRip 1080p':
        case 'WEB-DLRip 720p':
            return VideoQualityEnum.WEB;
        default:
            return VideoQualityEnum.UNKNOWN;
    }
}
