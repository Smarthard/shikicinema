import { isDueTime } from '@app/shared/utils/is-due-time.function';

export function isFreshToken(token: string, expiresTime: number | string | Date): boolean {
    const hasToken = token;
    const isFresh = isDueTime(expiresTime);

    return hasToken && isFresh;
}
