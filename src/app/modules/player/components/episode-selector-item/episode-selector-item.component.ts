import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
} from '@angular/core';
import { IonRippleEffect } from '@ionic/angular/standalone';

@Component({
    selector: 'app-episode-selector-item',
    imports: [
        IonRippleEffect,
    ],
    templateUrl: './episode-selector-item.component.html',
    styleUrl: './episode-selector-item.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'episode-selector-item ion-activatable',
        'tabindex': '0',
        '[id]': '`episode-${episode()}`',
        '[class.episode-selector-item--watched]': 'isWatched()',
        '[class.episode-selector-item--selected]': 'isSelected()',
        '[class.episode-selector-item--not-aired]': 'isNotAired()',
        '[class.episode-selector-item--long]': 'isLong()',
    },
})
export class EpisodeSelectorItemComponent {
    episode = input.required<number>();

    isWatched = input<boolean>(false);
    isSelected = input<boolean>(false);
    isNotAired = input<boolean>(false);

    readonly isLong = computed(() => this.episode() > 99);
}
