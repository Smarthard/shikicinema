import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const envFileContent = `import { EnvironmentInterface } from '@app-root/environments';

export const environment: EnvironmentInterface = {
    isProduction: ${isProduction},
    target: '${process.env.PLATFORM_TARGET}',
    kodik: {
        apiURI: '${process.env.KODIK_API_URI}',
        authToken: '${process.env.KODIK_AUTH_TOKEN}',
    },
    shikimori: {
        apiURI: '${process.env.SHIKIMORI_API_URI}',
        authClientId: '${process.env.SHIKIMORI_CLIENT_ID}',
        authClientSecret: '${process.env.SHIKIMORI_CLIENT_SECRET}',
        episodeNotificationToken: '${process.env.SHIKIMORI_EPISODE_NOTIFICATION_TOKEN}',
    },
    smarthard: {
        apiURI: '${process.env.SMARTHARD_API_URI}',
        authClientId: '${process.env.SMARTHARD_CLIENT_ID}',
        authClientSecret: '${process.env.SMARTHARD_CLIENT_SECRET}',
    },
};\n`;

function errorHandler(err: NodeJS.ErrnoException | null): void {
    if (err) {
        console.error(err);
    } else {
        console.log('Environment file generated');
    }
}

fs.writeFile(
    path.resolve('src', 'environments', 'environment.ts'),
    envFileContent,
    errorHandler,
);

fs.writeFile(
    path.resolve('src', 'environments', 'environment.prod.ts'),
    envFileContent,
    errorHandler,
);
