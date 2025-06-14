import { ImageLoader, ImageLoaderConfig } from '@angular/common';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN, SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { getPath } from '@app/shared/utils/get-path.function';

function getImageWidth(resource: string, loaderWidth: number | string, requestedWidth: string): string {
    const widthStr = `${loaderWidth}`;

    if (resource === 'animes') {
        switch (widthStr) {
            case '48':
            case '96':
                return `x${widthStr}`;
            case 'preview':
                return 'preview';
            default:
                return 'original';
        }
    }

    if (resource === 'users') {
        switch (widthStr) {
            case '16':
            case '32':
            case '48':
            case '64':
            case '80':
            case '148':
                return `x${widthStr}`;
            case '160':
            default:
                return 'x160';
        }
    }

    return requestedWidth;
}

// TODO: реализовать выбор меньших разрешений для ограниченного интернет соединения
export const shikimoriImageLoader = (): ImageLoader => {
    const domain$ = inject(SHIKIMORI_DOMAIN_TOKEN);
    const defaultShikimoriDomain = inject(DEFAULT_SHIKIMORI_DOMAIN_TOKEN);
    const domainSignal = toSignal(domain$);

    return (config: ImageLoaderConfig): string => {
        const path = getPath(config.src);
        const domain = domainSignal() || defaultShikimoriDomain;
        const isMissingImg = config?.src?.includes('globals/missing_original');

        if (isMissingImg) {
            return `${domain}${path}`;
        }

        const [, system, resource, resolution, resourceId] = path.split('/');
        const width = getImageWidth(resource, config?.width, resolution);

        return `${domain}/${system}/${resource}/${width}/${resourceId}`;
    };
};
