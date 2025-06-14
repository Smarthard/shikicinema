import {
    AsyncPipe,
    DatePipe,
    IMAGE_CONFIG,
    IMAGE_LOADER,
    NgIf,
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
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN, SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { GetShikimoriPagePipe } from '@app/shared/pipes/get-shikimori-page/get-shikimori-page.pipe';
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { ShikimoriMediaNamePipe } from '@app/shared/pipes/shikimori-media-name/shikimori-media-name.pipe';
import { ShikimoriMediaNameType } from '@app/shared/types/shikimori/shikimori-media-name.type';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
import { shikimoriImageLoader } from '@app/shared/utils/shikimori-image-loader.function';
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
        NgIf,
        AsyncPipe,
        DatePipe,
        RouterLink,
        UpperCasePipe,
        TranslocoPipe,
        ImageCardComponent,
        SkeletonBlockComponent,
        ShikimoriMediaNamePipe,
        GetShikimoriPagePipe,
        NgTemplateOutlet,
    ],
    providers: [
        {
            provide: IMAGE_CONFIG,
            useValue: {
                placeholderResolution: 32,
            },
        },
        {
            provide: IMAGE_LOADER,
            useFactory: shikimoriImageLoader,
            deps: [SHIKIMORI_DOMAIN_TOKEN, DEFAULT_SHIKIMORI_DOMAIN_TOKEN],
        },
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

    firstMediaName: ShikimoriMediaNameType;
    secondMediaName: ShikimoriMediaNameType;

    protected readonly isNothingFound = computed(() => !this.isLoading() && this.results().length === 0);
    protected readonly hasSearchResults = computed(() => !this.isLoading() && this.results().length > 0);

    whichNameFirstEffect = effect(() => {
        this.firstMediaName = this.originalNameFirst() ? 'original' : 'russian';
        this.secondMediaName = !this.originalNameFirst() ? 'original' : 'russian';
    });

    onResultClick($event: Event, result: SearchbarResult, target: ResultOpenTarget): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.openResult.emit([result, target]);
    }
}
