import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { toggleAnimeFiltersAction } from '@app/modules/home/store/anime-rates';

import { Store } from '@ngrx/store';

@Component({
    selector: 'app-filters-button',
    imports: [
        IonIcon,
        TranslocoPipe,
    ],
    templateUrl: './filters-button.component.html',
    styleUrl: './filters-button.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'tabindex': '0',
        'class': 'filters-btn',
        '(click)': 'onFiltersToggle()',
    },
})
export class FiltersButtonComponent {
    private readonly store = inject(Store);

    onFiltersToggle() {
        this.store.dispatch(toggleAnimeFiltersAction());
    }
}
