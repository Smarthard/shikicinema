import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { ShikicinemaMetaService } from '@app/core/services/shikicinema-meta.service';

export const shikicinemaVersionInterceptor: HttpInterceptorFn = (req, next) => {
    const shikicinemaMeta = inject(ShikicinemaMetaService);
    const version = shikicinemaMeta.getAppVersion();

    const modifiedReq = req.clone({
        setHeaders: {
            'X-Shikicinema': version,
        },
    });

    return next(modifiedReq);
};
