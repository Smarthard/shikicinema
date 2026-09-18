import { isDueTime } from '@app/shared/utils/is-due-time.function';

export function isFreshToken(token?: string, expiresTime?: number | string | Date): boolean {
    const hasToken = Boolean(token);
    const isFresh = expiresTime ? isDueTime(expiresTime) : false;

    return hasToken && isFresh;
}
