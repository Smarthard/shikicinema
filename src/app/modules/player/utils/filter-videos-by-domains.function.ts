import { VideoInfoInterface } from '@app/modules/player/types';
import { getDomain } from '@app/shared/utils/get-domain.function';


export function filterVideosByDomains(videos: VideoInfoInterface[], filterDomains: string[]): VideoInfoInterface[] {
    const filterDomainsSet = new Set(filterDomains);
    return videos?.filter(({ url }) => !filterDomainsSet.has(getDomain(url)));
}
