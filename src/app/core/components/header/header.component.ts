import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    filter,
    map,
    take,
    tap,
} from 'rxjs/operators';

import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';
import { authShikimoriAction } from '@app/store/auth/actions/auth.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    currentUser$: Observable<UserBriefInfoInterface>;
    avatarImg$: Observable<string>;
    nickname$: Observable<string>;
    profileLink$: Observable<string>;

    constructor(
        private store: Store,
    ) {}

    ngOnInit() {
        this.initializeValues();
    }

    initializeValues(): void {
        this.currentUser$ = this.store.select(selectShikimoriCurrentUser);
        this.avatarImg$ = this.currentUser$.pipe(map((user) => user?.image?.x64 || user?.avatar));
        this.nickname$ = this.currentUser$.pipe(map((user) => user?.nickname));
        this.profileLink$ = this.currentUser$.pipe(map((user) => user?.url));
    }

    toShikimoriProfilePage(): void {
        this.profileLink$.pipe(
            take(1),
            filter((profileLink) => !!profileLink),
            tap((profileLink) => window.open(profileLink)),
        ).subscribe();
    }

    shikimoriLogin(): void {
        this.store.dispatch(authShikimoriAction());
    }
}
