import { intersectionWith, isEqual } from 'lodash-es';

import { NoPreferenceSymbol, PreferencesValueType } from '@app/store/settings/types';
import { VideoInfoInterface, VideoKindEnum } from '@app/modules/player/types';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';
import { getDomain } from '@app/shared/utils/get-domain.function';


export function filterVideosByPreferences(
    videos: VideoInfoInterface[] | null,
    favAuthor: PreferencesValueType<string>,
    favDomain: PreferencesValueType<string>,
    favKind: PreferencesValueType<VideoKindEnum>,
): VideoInfoInterface[] | null {
    if (!videos) {
        return null;
    }

    // т.к. плеер сохраняет все эти значения сразу, то нет смысла усложнять и проверять остальные случаи
    const hasPreferences = typeof favAuthor !== typeof NoPreferenceSymbol &&
        typeof favDomain !== typeof NoPreferenceSymbol &&
        typeof favKind !== typeof NoPreferenceSymbol;

    // фильтруем по каждому критерию, чтобы потом находить пересечения в них
    const byAuthor = videos.filter(({ author }) => hasPreferences
        ? cleanAuthorName(author ?? '') === cleanAuthorName(favAuthor as string)
        : false);
    const byDomain = videos.filter(({ url }) => hasPreferences ? getDomain(url) === favDomain : false);
    const byKind = videos.filter(({ kind }) => hasPreferences ? kind === favKind : false);

    // ищем пересечения (от лучшего к худшему по релевантности)
    const bingo = intersectionWith(byAuthor, byDomain, byKind, isEqual);

    if (bingo.length > 0) {
        return bingo;
    }

    const sameAuthorKind = intersectionWith(byAuthor, byKind, isEqual);
    const sameDomainKind = intersectionWith(byDomain, byKind, isEqual);

    switch (true) {
        case sameAuthorKind.length > 0: return sameAuthorKind;
        case sameDomainKind.length > 0: return sameDomainKind;
        case byAuthor.length > 0: return byAuthor;
        case byKind.length > 0: return byKind;

        default: return null;
    }
}
