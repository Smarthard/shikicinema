export type PlatformTargetType = 'web-extension' | 'native-app';

export interface EnvironmentInterface {
    isProduction: boolean;
    target: PlatformTargetType;
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
