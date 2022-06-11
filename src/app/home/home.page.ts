import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, tap } from 'rxjs/operators';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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

    userAnimeRatesFake = new Array<number>(100).fill(0);

    cardHeight: string;
    cardWidth: string;

    trackById = trackById;

    constructor(
        private readonly breakpointObserver: BreakpointObserver,
    ) {}

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

        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ])
            .pipe(
                untilDestroyed(this),
                map(({ breakpoints }) => Object.entries(breakpoints)
                    .filter(([_, matched]) => matched)
                    .map(([breakpoint, _]) => breakpoint)
                    ?.[0]
                ),
                tap((breakpoint) => {
                    const baseHeight = 20;
                    const baseWidth = 14;
                    let multiplier: number;

                    switch (breakpoint) {
                        case Breakpoints.XSmall:
                        case Breakpoints.Small:
                            multiplier = .8;
                            break;
                        case Breakpoints.Medium:
                        case Breakpoints.Large:
                        case Breakpoints.XLarge:
                        default:
                            multiplier = 1.0;
                            break;
                    }

                    this.cardHeight = `${baseHeight * multiplier}rem`;
                    this.cardWidth = `${baseWidth * multiplier}rem`;
                })
            )
            .subscribe();
    }
}
