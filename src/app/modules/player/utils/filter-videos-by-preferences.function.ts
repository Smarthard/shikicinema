import { NoPreferenceSymbol, PreferencesValueType } from '@app/store/settings/types';
import { VideoInfoInterface } from '@app/modules/player/types';
import { cleanAuthorName } from '@app/shared/utils/clean-author-name.function';
import { getDomain } from '@app/shared/utils/get-domain.function';
import { intersection } from '@app/shared/utils/intersection.function';


export function filterVideosByPreferences(
    videos: VideoInfoInterface[],
    favAuthor: PreferencesValueType<string>,
    favDomain: PreferencesValueType<string>,
    favKind: PreferencesValueType<string>,
): VideoInfoInterface[] | null {
    // т.к. плеер сохраняет все эти значения сразу, то нет смысла усложнять и проверять остальные случаи
    const hasPreferences = typeof favAuthor !== typeof NoPreferenceSymbol &&
        typeof favDomain !== typeof NoPreferenceSymbol &&
        typeof favKind !== typeof NoPreferenceSymbol;

    // фильтруем по каждому критерию, чтобы потом находить пересечения в них
    const byAuthor = videos?.filter(({ author }) => hasPreferences
        ? cleanAuthorName(author) === cleanAuthorName(favAuthor as string)
        : false);
    const byDomain = videos?.filter(({ url }) => hasPreferences ? getDomain(url) === favDomain : false);
    const byKind = videos?.filter(({ kind }) => hasPreferences ? kind === favKind : false);

    // ищем пересечения (от лучшего к худшему по релевантности)
    const bingo = intersection(byAuthor, byDomain, byKind);

    if (bingo?.length > 0) {
        return bingo;
    }

    const sameAuthorKind = intersection(byAuthor, byKind);
    const sameDomainKind = intersection(byDomain, byKind);

    switch (true) {
        case sameAuthorKind?.length > 0: return sameAuthorKind;
        case sameDomainKind?.length > 0: return sameDomainKind;
        case byAuthor?.length > 0: return byAuthor;
        case byKind?.length > 0: return byKind;

        default: return null;
    }
}
