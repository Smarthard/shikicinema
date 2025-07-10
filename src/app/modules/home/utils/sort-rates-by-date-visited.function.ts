import { UserBriefRateInterface } from '@app/shared/types/shikimori';

export function sortRatesByDateVisited(userRates: UserBriefRateInterface[]): UserBriefRateInterface[] {
    return userRates.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
}
