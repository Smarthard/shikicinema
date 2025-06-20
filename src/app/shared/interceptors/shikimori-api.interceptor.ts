import {
    BehaviorSubject,
    EMPTY,
    throwError,
} from 'rxjs';
import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
    HttpStatusCode,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
    catchError,
    last,
    switchMap,
    tap,
} from 'rxjs/operators';
import { inject } from '@angular/core';

import AuthStoreInterface, { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';
import { PersistenceService } from '@app/shared/services/persistence.service';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { attachAccessToken } from '@app/shared/utils/attach-access-token.function';
import { changeShikimoriCredentialsAction, logoutShikimoriAction } from '@app/store/auth/actions/auth.actions';


export const shikimoriApiInterceptor: HttpInterceptorFn = (request, next) => {
    const shikimoriClient = inject(ShikimoriClient);
    const persistenceService = inject(PersistenceService);
    const store = inject(Store);

    let isRefreshing = false;
    let refreshTokenSubject$: BehaviorSubject<string> = null;

    function handleUnauthorized(request: HttpRequest<unknown>, next: HttpHandlerFn) {
        if (isRefreshing) {
            return refreshTokenSubject$.pipe(
                last(),
                switchMap((token) => token
                    ? next(attachAccessToken(request, token))
                    : EMPTY,
                ),
            );
        }

        isRefreshing = true;
        refreshTokenSubject$ = new BehaviorSubject<string>(null);

        const { shikimoriRefreshToken } = persistenceService.getItem<AuthStoreInterface>('auth');

        return shikimoriClient.refreshToken(shikimoriRefreshToken).pipe(
            tap((credentials) => store.dispatch(changeShikimoriCredentialsAction({ credentials }))),
            switchMap(({ shikimoriBearerToken }: ShikimoriCredentials) => {
                isRefreshing = false;
                refreshTokenSubject$.next(shikimoriBearerToken);
                refreshTokenSubject$.complete();

                return next(attachAccessToken(request, shikimoriBearerToken));
            }),
            catchError((err: unknown) => {
                isRefreshing = false;
                refreshTokenSubject$.next(null);
                refreshTokenSubject$.complete();
                store.dispatch(logoutShikimoriAction());

                return throwError(() => err);
            }),
        );
    }


    // Обрабатываем запросы в Шикимори, КРОМЕ запросов на обновление токенов
    if (!request?.url?.startsWith('https://shikimori') || request?.params?.get('refresh_token')) {
        return next(request);
    }

    const { shikimoriBearerToken } = persistenceService.getItem<AuthStoreInterface>('auth');

    if (shikimoriBearerToken) {
        request = attachAccessToken(request, shikimoriBearerToken);
    }

    return next(request).pipe(
        catchError((error) => {
            /*
                Шикимори не разрешает использовать куки для отправки комментов
                за пределами своего домена. Их можно отправлять только ЧЕРЕЗ ТОКЕН!
                В противном случае будем получать ошибку 422
            */
            const isSendCommentReq = error instanceof HttpErrorResponse &&
                error.status === HttpStatusCode.UnprocessableEntity &&
                request.url.endsWith('/api/comments') &&
                shikimoriBearerToken;

            const isGenericUnauthorizedReq = error instanceof HttpErrorResponse &&
                error.status === HttpStatusCode.Unauthorized &&
                shikimoriBearerToken;

            const isTokensManuallyDeleted = error instanceof HttpErrorResponse &&
                error.status === HttpStatusCode.Unauthorized &&
                !shikimoriBearerToken;

            if (isSendCommentReq || isGenericUnauthorizedReq) {
                return handleUnauthorized(request, next);
            }

            if (isTokensManuallyDeleted) {
                store.dispatch(logoutShikimoriAction());
            }

            return throwError(() => error);
        }),
    );
};

