import { Actions, ofType } from '@ngrx/effects';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Observable,
    throwError,
} from 'rxjs';
import { Store } from '@ngrx/store';
import {
    catchError,
    combineLatestWith,
    exhaustMap,
    filter,
    map,
    skip,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';

import AuthStoreInterface from '@app/store/auth/types/auth-store.interface';
import { PersistenceService } from '@app/shared/services/persistence.service';
import { ShikicinemaStoreInterface } from '@app/store/shikicinema/types/shikicinema-store.interface';
import { UploadToken } from '@app/shared/types/shikicinema/v1';
import { authShikimoriAction, authShikimoriSuccessAction } from '@app/store/auth/actions/auth.actions';
import { concatLatestFrom } from '@ngrx/operators';
import {
    getUploadTokenAction,
    getUploadTokenSuccessAction,
} from '@app/store/shikicinema/actions/get-upload-token.action';
import { isFreshToken } from '@app/shared/utils/is-fresh-token.function';
import {
    selectShikicinemaTokenProcessing,
    selectShikicinemaUploadToken,
} from '@app/store/shikicinema/selectors/shikicinema.selectors';

@Injectable()
export class ShikicinemaApiInterceptor implements HttpInterceptor {
    constructor(
        private persistenceService: PersistenceService,
        private actions$: Actions,
        private store: Store,
    ) {}

    private static attachAccessToken(request: HttpRequest<unknown>, token: UploadToken) {
        return request.clone({
            setHeaders: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: `Bearer ${token.access_token}`,
            },
        });
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isShikicinemaApi = request?.url?.includes('smarthard');
        const isPostRequest = request?.method === 'POST';

        // пропускаем запросы не для загрузки видео
        if (!isShikicinemaApi || !isPostRequest) {
            return next.handle(request);
        }

        const { uploadToken } = this.persistenceService.getItem<ShikicinemaStoreInterface>('shikicinema');
        const shikimoriToken = this.persistenceService.getItem<AuthStoreInterface>('auth');

        if (isFreshToken(uploadToken?.access_token, uploadToken?.expires)) {
            // если есть свежий upload token прикрепляем
            request = ShikicinemaApiInterceptor.attachAccessToken(request, uploadToken);
        } else if (isFreshToken(shikimoriToken?.shikimoriBearerToken, shikimoriToken?.accessExpireTimeMs)) {
            // если нет, но есть свежий токен Шикимори, то обновляем и прикрепляем
            this.store.dispatch(getUploadTokenAction({ shikimoriToken }));

            return this.actions$.pipe(
                ofType(getUploadTokenSuccessAction),
                map(({ uploadToken }) => ShikicinemaApiInterceptor.attachAccessToken(request, uploadToken)),
                exhaustMap((req) => next.handle(req)),
            );
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this._refreshShikimoriTokens(request, next);
                }

                return throwError(() => error);
            }),
        );
    }

    private _refreshShikimoriTokens(request: HttpRequest<unknown>, next: HttpHandler) {
        const {
            shikimoriRefreshToken,
            refreshExpireTimeMs,
        } = this.persistenceService.getItem<AuthStoreInterface>('auth');

        // можем обновить токен Шикимори
        if (isFreshToken(shikimoriRefreshToken, refreshExpireTimeMs)) {
            // TODO: сделать отдельный экшен для обновления токенов
            this.store.dispatch(authShikimoriAction());
        } else {
            this.store.dispatch(authShikimoriAction());
        }

        // ждём новые токены Шикимори для обновления upload token и повторяем запрос
        return this.actions$.pipe(
            ofType(authShikimoriSuccessAction),
            tap(({ credentials: shikimoriToken }) => this.store.dispatch(getUploadTokenAction({ shikimoriToken }))),
            switchMap(() => this.store.select(selectShikicinemaTokenProcessing).pipe(
                skip(1),
                filter((isProcessing) => !isProcessing),
            )),
            switchMap(() => this.store.select(selectShikicinemaUploadToken).pipe(
                filter(({ access_token: token, expires }) => isFreshToken(token, expires)),
            )),
            map((uploadToken) => ShikicinemaApiInterceptor.attachAccessToken(request, uploadToken)),
            exhaustMap((req) => next.handle(req)),
        );
    }
}

