import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';

import { Observable } from 'rxjs';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { ShikimoriMediaNameType } from '@app/shared/types/shikimori/shikimori-media-name.type';
import { trackById } from '@app/shared/utils/common-ngfor-tracking';

@Component({
    selector: 'app-searchbar-results',
    templateUrl: './searchbar-results.component.html',
    styleUrls: ['./searchbar-results.component.scss'],
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
