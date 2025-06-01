import { AsyncPipe, DatePipe, NgIf, UpperCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { Observable } from 'rxjs';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { ShikimoriMediaNamePipe } from '@app/shared/pipes/shikimori-media-name/shikimori-media-name.pipe';
import { ShikimoriMediaNameType } from '@app/shared/types/shikimori/shikimori-media-name.type';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SearchbarResultsComponent {
    @Input()
    results: SearchbarResult[] | null;

    @Input()
    isLoading: boolean;

    @Output()
    openResult = new EventEmitter<[SearchbarResult, ResultOpenTarget]>();

    firstMediaName: ShikimoriMediaNameType;
    secondMediaName: ShikimoriMediaNameType;

    fakeResults = new Array<number>(15).fill(0);

    trackById = trackById;

    constructor(
        @Inject(SHIKIMORI_DOMAIN_TOKEN)
        readonly shikimoriDomain$: Observable<string>,
    ) {}

    @Input()
    set originalNameFirst(isOriginFirst: boolean) {
        this.firstMediaName = isOriginFirst ? 'original' : 'russian';
        this.secondMediaName = !isOriginFirst ? 'original' : 'russian';
    }

    onResultClick($event: Event, result: SearchbarResult, target: ResultOpenTarget): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.openResult.next([result, target]);
    }
}
