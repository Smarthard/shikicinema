import { inject, Injector } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectShikimoriDomain } from '@app/store/shikimori/selectors';

export function injectShikimoriDomain(path: string | number, injector?: Injector): string {
    const store = injector?.get(Store) || inject(Store);
    const domain = store.selectSignal(selectShikimoriDomain);
    const pathStr = `${path}`;
    const normalized = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;

    return `${domain()}${normalized}`
}
