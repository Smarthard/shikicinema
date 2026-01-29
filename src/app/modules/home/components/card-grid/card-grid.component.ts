import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
    input,
    signal,
} from '@angular/core';
import { RepeatPipe } from 'ngxtension/repeat-pipe';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { CardGridItemComponent } from '@app/modules/home/components/card-grid-item/card-grid-item.component';
import {
    GetAnimeKindPipe,
    GetAnimeNamePipe,
    GetAnimePosterPipe,
    GetAnimeReleaseDatePipe,
} from '@app/modules/home/pipes';
import { GetPlayerLinkPipe } from '@app/shared/pipes/get-player-link/get-player-link.pipe';
import { IS_SUPPORTS_AVIF } from '@app/core/providers/avif';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { UserAnimeRate } from '@app/shared/types/shikimori';
import { provideSmarthardNetImageLoader } from '@app/shared/providers';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-card-grid',
    templateUrl: './card-grid.component.html',
    styleUrls: ['./card-grid.component.scss'],
    imports: [
        AsyncPipe,
        NgTemplateOutlet,
        SkeletonBlockComponent,
        CardGridItemComponent,
        GetPlayerLinkPipe,
        GetAnimeNamePipe,
        RepeatPipe,
        GetAnimePosterPipe,
        GetAnimeKindPipe,
        GetAnimeReleaseDatePipe,
    ],
    providers: [
        provideSmarthardNetImageLoader(),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'anime-grid' },
})
export class CardGridComponent {
    private readonly _transloco = inject(TranslocoService);

    readonly trackById = trackById;

    readonly isSupportsAvif = toSignal(inject(IS_SUPPORTS_AVIF));
    readonly currentLang = toSignal(this._transloco.langChanges$);

    // TODO: добавить подключение настройки для экономия трафика
    readonly isHiRes = signal(true);

    userAnimeRates = input.required<UserAnimeRate[]>();

    isLoading = input(true);
    hasPriority = input(false);
    size = input(50);
}
