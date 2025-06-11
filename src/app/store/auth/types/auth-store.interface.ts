export interface ShikimoriCredentials {
    shikimoriBearerToken: string;
    shikimoriRefreshToken: string;
    accessExpireTimeMs: number;
    refreshExpireTimeMs: number;
    scopes: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface AuthStoreInterface extends ShikimoriCredentials {}
