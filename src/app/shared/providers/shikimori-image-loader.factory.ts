import { ImageLoader, ImageLoaderConfig } from '@angular/common';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';

import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { getPath } from '@app/shared/utils/get-path.function';
import { selectShikimoriDomain } from '@app/store/shikimori/selectors';

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
    const store = inject(Store);
    const domainSignal = store.selectSignal(selectShikimoriDomain);
    const defaultShikimoriDomain = inject(DEFAULT_SHIKIMORI_DOMAIN_TOKEN);

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
