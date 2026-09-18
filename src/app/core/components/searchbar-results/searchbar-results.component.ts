import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
    output,
} from '@angular/core';
import {
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
} from '@ionic/angular';
import { RepeatPipe } from 'ngxtension/repeat-pipe';
import { TranslocoPipe } from '@jsverse/transloco';

import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { provideShikimoriImageLoader } from '@app/shared/providers/shikimori-image-loader.provider';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';
import { SearchbarResultItemComponent } from '@app/core/components/searchbar-result-item';

@Component({
    selector: 'app-searchbar-results',
    templateUrl: './searchbar-results.component.html',
    styleUrls: ['./searchbar-results.component.scss'],
    imports: [
        IonList,
        IonItem,
        IonLabel,
        IonNote,
        IonText,
        TranslocoPipe,
        NgTemplateOutlet,
        RepeatPipe,
        SearchbarResultItemComponent,
        SkeletonBlockComponent,
    ],
    providers: [
        provideShikimoriImageLoader(96),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'searchbar-results'
    },
})
export class SearchbarResultsComponent {
    readonly trackById = trackById;

    results = input.required<SearchbarResult[]>();
    originalNameFirst = input.required<boolean>();

    isLoading = input<boolean>(true);

    openResult = output<[SearchbarResult, ResultOpenTarget]>();

    protected readonly isNothingFound = computed(() => !this.isLoading() && this.results().length === 0);
    protected readonly hasSearchResults = computed(() => !this.isLoading() && this.results().length > 0);

    onResultClick(clickEvent: [SearchbarResult, ResultOpenTarget]): void {
        this.openResult.emit(clickEvent);
    }
}
