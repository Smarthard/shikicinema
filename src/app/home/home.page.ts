import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikimoriState } from '@app/store/shikimori/shikimori.state';
import { GetUserAnimeRatesAction } from '@app/store/shikimori/shikimori.actions';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@UntilDestroy()
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    @Select(ShikimoriState.currentUser)
    currentUser$: Observable<UserBriefInfoInterface>;

    @Select(ShikimoriState.userAnimeRates)
    userAnimeRates$: Observable<UserAnimeRate[]>;

    trackById = trackById;

    @Dispatch()
    getUserAnimeRates = (userId: ResourceIdType) => new GetUserAnimeRatesAction(userId);

    ngOnInit() {
        this.initializeSubscriptions();
    }

    initializeSubscriptions() {
        this.currentUser$
            .pipe(
                untilDestroyed(this),
                tap((currenUser) => {
                    if (currenUser?.id) {
                        this.getUserAnimeRates(currenUser.id);
                    }
                }),
            )
            .subscribe();
    }
}
