import { IMAGE_CONFIG, IMAGE_LOADER } from '@angular/common';
import { Provider } from '@angular/core';

import { smarthardNetImageLoader } from '@app/shared/providers/smarthard-image-loader.factory';


export function provideSmarthardNetImageLoader(): Provider[] {
    return [
        {
            provide: IMAGE_CONFIG,
            useValue: {},
        },
        {
            provide: IMAGE_LOADER,
            useFactory: smarthardNetImageLoader,
        },
    ];
}
