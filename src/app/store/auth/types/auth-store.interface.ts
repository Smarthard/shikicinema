export interface ShikimoriCredentials {
    shikimoriBearerToken: string;
    shikimoriRefreshToken: string;
    accessExpireTimeMs: number;
    refreshExpireTimeMs: number;
    scopes: string[];
}

export type AuthStoreInterface = ShikimoriCredentials;
