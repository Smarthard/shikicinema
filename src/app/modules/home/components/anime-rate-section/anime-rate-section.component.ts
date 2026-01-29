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

import { CardGridComponent } from '@app/modules/home/components/card-grid';
import { UserAnimeRate } from '@app/shared/types/shikimori';

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
        '[class.ion-hide]': 'isSectionHidden(!isLoading(), rates())',
    },
})
export class AnimeRateSectionComponent {
    label = input.required<string>();
    status = input.required<string>();
    rates = input.required<UserAnimeRate[]>();

    isHidden = input(false);
    isLoading = input(true);
    hasPriority = input(false);
    size = input(50);

    visible = output();
    toggleHidden = output();

    ratesCount = computed(() => this.rates()?.length || 0);

    isSectionHidden(isLoaded: boolean, rates: UserAnimeRate[]): boolean {
        return isLoaded && !rates?.length;
    }

    onToggleHidden(): void {
        this.toggleHidden.emit();
    }
}
