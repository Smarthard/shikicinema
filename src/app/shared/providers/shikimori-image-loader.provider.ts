import { IMAGE_CONFIG, IMAGE_LOADER } from '@angular/common';
import { Provider } from '@angular/core';

import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN, SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { shikimoriImageLoader } from '@app/shared/providers/shikimori-image-loader.factory';


export function provideShikimoriImageLoader(placeholderResolution: number): Provider[] {
    return [
        {
            provide: IMAGE_CONFIG,
            useValue: {
                placeholderResolution,
            },
        },
        {
            provide: IMAGE_LOADER,
            useFactory: shikimoriImageLoader,
            deps: [SHIKIMORI_DOMAIN_TOKEN, DEFAULT_SHIKIMORI_DOMAIN_TOKEN],
        },
    ];
}
