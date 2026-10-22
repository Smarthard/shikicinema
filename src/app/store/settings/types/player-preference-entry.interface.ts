import { VideoKindEnum } from '@app/modules/player/types/video-kind.enum';

export interface PlayerPreferenceEntry {
    author?: string | null;
    kind: VideoKindEnum;
    domain: string;
    watches: number;
    lastWatchedAt: number;
}
