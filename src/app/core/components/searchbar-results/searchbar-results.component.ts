import {
    AsyncPipe,
    DatePipe,
    NgTemplateOutlet,
    UpperCasePipe,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    effect,
    input,
    output,
} from '@angular/core';
import {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';

import { GetShikimoriPagePipe } from '@app/shared/pipes/get-shikimori-page/get-shikimori-page.pipe';
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { ShikimoriMediaNamePipe } from '@app/shared/pipes/shikimori-media-name/shikimori-media-name.pipe';
import { ShikimoriMediaNameType } from '@app/shared/types/shikimori/shikimori-media-name.type';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { provideShikimoriImageLoader } from '@app/shared/providers/shikimori-image-loader.provider';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

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
        IonButton,
        IonIcon,
        AsyncPipe,
        DatePipe,
        UpperCasePipe,
        TranslocoPipe,
        ImageCardComponent,
        SkeletonBlockComponent,
        ShikimoriMediaNamePipe,
        GetShikimoriPagePipe,
        NgTemplateOutlet,
    ],
    providers: [
        provideShikimoriImageLoader(96),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SearchbarResultsComponent {
    readonly trackById = trackById;
    readonly fakeResults = new Array<number>(5).fill(0);

    results = input<SearchbarResult[]>();

    isLoading = input<boolean>();

    originalNameFirst = input<boolean>();

    openResult = output<[SearchbarResult, ResultOpenTarget]>();

    protected readonly firstMediaName = computed(() => this.originalNameFirst() ? 'original' : 'russian');
    protected readonly secondMediaName = computed(() => !this.originalNameFirst() ? 'original' : 'russian');
    protected readonly isNothingFound = computed(() => !this.isLoading() && this.results().length === 0);
    protected readonly hasSearchResults = computed(() => !this.isLoading() && this.results().length > 0);

    onResultClick($event: Event, result: SearchbarResult, target: ResultOpenTarget): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.openResult.emit([result, target]);
    }
}
