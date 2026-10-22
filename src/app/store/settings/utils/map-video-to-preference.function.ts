import { VideoInfoInterface } from '@app/modules/player/types';
import { getDomain } from '@app/shared/utils/get-domain.function';
import { PlayerPreferenceEntry } from '@app/store/settings/types';


export function mapVideoToPreference({ url, kind, author }: VideoInfoInterface): PlayerPreferenceEntry {
    return {
        domain: getDomain(url),
        kind,
        author,
        lastWatchedAt: 0,
        watches: Number.NEGATIVE_INFINITY,
    };
}
