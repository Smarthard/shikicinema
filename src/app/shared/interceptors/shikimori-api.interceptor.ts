import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {
    BehaviorSubject,
    EMPTY,
    Observable,
    throwError,
} from 'rxjs';
import {
    catchError,
    last,
    switchMap,
    tap,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';

import AuthStoreInterface, { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';
import { ShikimoriClient } from '@app/shared/services/shikimori-client.service';
import { PersistenceService } from '@app/shared/services/persistence.service';
import { changeShikimoriCredentialsAction, logoutShikimoriAction } from '@app/store/auth/actions/auth.actions';

@Injectable()
export class ShikimoriApiInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string> = null;

    constructor(
        private shikimoriClient: ShikimoriClient,
        private persistenceService: PersistenceService,
        private store: Store,
    ) {}

    private static attachAccessToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: `Bearer ${token}`,
            },
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // if this is refresh token request - do not handle it
        if (request?.params?.get('refresh_token')) {
            return next.handle(request);
        }

        const { shikimoriBearerToken } = this.persistenceService.getItem<AuthStoreInterface>('auth');

        if (shikimoriBearerToken) {
            request = ShikimoriApiInterceptor.attachAccessToken(request, shikimoriBearerToken);
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401 && shikimoriBearerToken) {
                    return this.handleUnauthorized(request, next);
                }

                if (error instanceof HttpErrorResponse && error.status === 401 && !shikimoriBearerToken) {
                    this.store.dispatch(logoutShikimoriAction());
                }

                return throwError(error);
            }),
        );
    }

    private handleUnauthorized(request: HttpRequest<any>, next: HttpHandler) {
        if (this.isRefreshing) {
            return this.refreshTokenSubject.pipe(
                last(),
                switchMap((token) => token
                    ? next.handle(ShikimoriApiInterceptor.attachAccessToken(request, token))
                    : EMPTY
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
            catchError((err: any) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(null);
                this.refreshTokenSubject.complete();
                this.store.dispatch(logoutShikimoriAction());

                return throwError(err);
            }),
        );
    }

}

