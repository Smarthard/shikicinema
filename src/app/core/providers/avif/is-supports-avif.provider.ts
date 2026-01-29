import { Provider } from '@angular/core';

import { IS_SUPPORTS_AVIF } from '@app/core/providers/avif/is-supports-avif.token';
import { isSupportsAvif } from '@app/shared/utils/is-supports-avif.function';

export function provideIsSupportsAvif(): Provider[] {
    return [
        { provide: IS_SUPPORTS_AVIF, useFactory: isSupportsAvif },
    ];
}
