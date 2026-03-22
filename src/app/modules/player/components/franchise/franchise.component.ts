import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    input,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { FranchiseItemComponent } from '@app/modules/player/components/franchise-item/franchise-item.component';
import { ResourceIdType } from '@app/shared/types';
import { TranslocoService } from '@jsverse/transloco';
import { getFranchiseAction } from '@app/modules/player/store/actions';
import { provideSmarthardNetImageLoader } from '@app/shared/providers';
import {
    selectPlayerFranchise,
    selectPlayerIsFranchiseLoading,
} from '@app/modules/player/store/selectors/player.selectors';
import { sortFranchise } from '@app/modules/player/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-franchise',
    imports: [
        RouterLink,
        FranchiseItemComponent,
    ],
    providers: [
        provideSmarthardNetImageLoader(),
    ],
    templateUrl: './franchise.component.html',
    styleUrl: './franchise.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'franchise',
    },
})
export class FranchiseComponent {
    private readonly store = inject(Store);
    private readonly transloco = inject(TranslocoService);
    private readonly router = inject(Router);

    animeId = input.required<ResourceIdType>();

    isFranchiseLoading = computed(() => this.store.selectSignal(selectPlayerIsFranchiseLoading(this.animeId())));
    franchise = computed(() => this.store.selectSignal(selectPlayerFranchise(this.animeId()))());

    readonly trackById = trackById;
    readonly language = toSignal(this.transloco.langChanges$);

    /* TODO: сделать отдельную настройку для отображения названий */
    readonly isEnglishNamesPrefered = computed(() => this.language() !== 'ru');

    readonly sortedFranchise = computed(
        () => this.franchise()
            ?.filter(({ anime }) => anime?.id)
            ?.sort(sortFranchise),
    );

    onAnimeIdChangeEffect = effect(() => this.store.dispatch(getFranchiseAction({ animeId: this.animeId() })));

    onNavigate(link: string): void {
        this.router.navigateByUrl(link);
    }
}
