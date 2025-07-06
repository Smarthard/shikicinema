import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
    output,
} from '@angular/core';
import { IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { NgxVisibilityDirective } from 'ngx-visibility';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';

import { CardGridComponent } from '@app/modules/home/components/card-grid';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

@Component({
    selector: 'app-anime-rate-section',
    imports: [
        NgxVisibilityDirective,
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
        '[class.ion-hide]': 'isSectionHidden(isLoaded(), rates())',
    },
})
export class AnimeRateSectionComponent {
    label = input.required<string>();
    status = input.required<string>();
    rates = input.required<UserAnimeRate[]>();
    isHidden = input(false);
    isLoaded = input(false);

    visible = output();
    toggleHidden = output();

    ratesCount = computed(() => this.rates()?.length || 0);

    isSectionHidden(isLoaded: boolean, rates: UserAnimeRate[]): boolean {
        return isLoaded && !rates?.length;
    }

    onSectionVisible(isVisible: boolean): void {
        if (isVisible) {
            this.visible.emit();
        }
    }

    onToggleHidden(): void {
        this.toggleHidden.emit();
    }
}
