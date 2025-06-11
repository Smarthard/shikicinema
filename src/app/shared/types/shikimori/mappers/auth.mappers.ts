import { Credentials } from '@app/shared/types/shikimori/credentials';
import { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';

export function toShikimoriCredentials(origin: Credentials): ShikimoriCredentials {
    const dayInSeconds = 24 * 60 * 60;

    return {
        shikimoriRefreshToken: origin.refresh_token,
        shikimoriBearerToken: origin.access_token,
        accessExpireTimeMs: (Number(origin.created_at) + Number(origin.expires_in)) * 1000,
        refreshExpireTimeMs: (Number(origin.created_at) + dayInSeconds * 14) * 1000,
        scopes: origin.scope?.split(' ') || [],
    };
}
