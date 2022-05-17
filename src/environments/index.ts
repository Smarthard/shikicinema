export interface EnvironmentInterface {
    isProduction: boolean;
    shikimori: {
        apiURI: string;
        authClientId: string;
        authClientSecret: string;
        episodeNotificationToken: string;
    };
    smarthard: {
        apiURI: string;
        authClientId: string;
        authClientSecret: string;
    };
    kodik: {
        apiURI: string;
        authToken: string;
    };
}
