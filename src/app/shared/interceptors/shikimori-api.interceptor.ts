import {
    BehaviorSubject,
    EMPTY,
    Observable,
    throwError,
} from 'rxjs';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpStatusCode,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    catchError,
    last,
    switchMap,
    tap,
} from 'rxjs/operators';

import AuthStoreInterface, { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';
import { PersistenceService } from '@app/shared/services/persistence.service';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { changeShikimoriCredentialsAction, logoutShikimoriAction } from '@app/store/auth/actions/auth.actions';

@Injectable()
export class ShikimoriApiInterceptor implements HttpInterceptor {
    private readonly shikimoriClient = inject(ShikimoriClient);
    private readonly persistenceService = inject(PersistenceService);
    private readonly store = inject(Store);

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string> = null;

    private static attachAccessToken(request: HttpRequest<unknown>, token: string) {
        const headers = request.headers.set('Authorization', `Bearer ${token}`);

        return request.clone({ headers });
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Обрабатываем запросы в Шикимори, КРОМЕ запросов на обновление токенов
        if (!request?.url?.startsWith('https://shikimori') || request?.params?.get('refresh_token')) {
            return next.handle(request);
        }

        const { shikimoriBearerToken } = this.persistenceService.getItem<AuthStoreInterface>('auth');

        if (shikimoriBearerToken) {
            request = ShikimoriApiInterceptor.attachAccessToken(request, shikimoriBearerToken);
        }

        return next.handle(request).pipe(
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
                    return this.handleUnauthorized(request, next);
                }

                if (isTokensManuallyDeleted) {
                    this.store.dispatch(logoutShikimoriAction());
                }

                return throwError(() => error);
            }),
        );
    }

    private handleUnauthorized(request: HttpRequest<unknown>, next: HttpHandler) {
        if (this.isRefreshing) {
            return this.refreshTokenSubject.pipe(
                last(),
                switchMap((token) => token
                    ? next.handle(ShikimoriApiInterceptor.attachAccessToken(request, token))
                    : EMPTY,
                ),
            );
        }

        this.isRefreshing = true;
        this.refreshTokenSubject = new BehaviorSubject<string>(null);

        const { shikimoriRefreshToken } = this.persistenceService.getItem<AuthStoreInterface>('auth');

        return this.shikimoriClient.refreshToken(shikimoriRefreshToken).pipe(
            tap((credentials) => this.store.dispatch(changeShikimoriCredentialsAction({ credentials }))),
            switchMap(({ shikimoriBearerToken }: ShikimoriCredentials) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(shikimoriBearerToken);
                this.refreshTokenSubject.complete();

                return next.handle(ShikimoriApiInterceptor.attachAccessToken(request, shikimoriBearerToken));
            }),
            catchError((err: unknown) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(null);
                this.refreshTokenSubject.complete();
                this.store.dispatch(logoutShikimoriAction());

                return throwError(() => err);
            }),
        );
    }
}

