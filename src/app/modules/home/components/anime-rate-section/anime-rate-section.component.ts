import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
    output,
} from '@angular/core';
import { IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';

import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates';
import { CardGridComponent } from '@app/modules/home/components/card-grid';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';

@Component({
    selector: 'app-anime-rate-section',
    imports: [
        TranslocoPipe,
        IonIcon,
        IonButton,
        IonText,
        UpperCasePipe,
        CardGridComponent,
    ],
    templateUrl: './anime-rate-section.component.html',
    styleUrl: './anime-rate-section.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'anime-rate-section',
        '[id]': 'status()',
        '[class.ion-hide]': 'isSectionHidden(!isRatesLoading(), rates())',
    },
})
export class AnimeRateSectionComponent {
    label = input.required<string>();
    status = input.required<string>();
    rates = input.required<UserBriefRateInterface[]>();
    ratesMetadata = input.required<AnimeRatesMetadata>();

    isHidden = input(false);
    isRatesLoading = input(true);
    isMetaLoading = input(true);

    visible = output();
    toggleHidden = output();

    ratesCount = computed(() => this.rates()?.length || 0);

    isSectionHidden(isLoaded: boolean, rates: UserBriefRateInterface[]): boolean {
        return isLoaded && !rates?.length;
    }

    onToggleHidden(): void {
        this.toggleHidden.emit();
    }
}
