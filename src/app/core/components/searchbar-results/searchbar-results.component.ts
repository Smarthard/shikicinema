import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

import { trackById } from '@app-root/app/shared/utils/common-ngfor-tracking';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { ShikimoriMediaNameType } from '@app/shared/types/shikimori/shikimori-media-name.type';

@Component({
    selector: 'app-searchbar-results',
    templateUrl: './searchbar-results.component.html',
    styleUrls: ['./searchbar-results.component.scss'],
})
export class SearchbarResultsComponent {

    @Input()
    results: SearchbarResult[] | null;

    @Input()
    isLoading: boolean;

    @Output()
    openResult = new EventEmitter<[ SearchbarResult, ResultOpenTarget ]>();

    firstMediaName: ShikimoriMediaNameType;
    secondMediaName: ShikimoriMediaNameType;

    fakeResults = new Array<number>(15).fill(0);

    trackById = trackById;

    @Input()
    set originalNameFirst(isOriginFirst: boolean) {
        this.firstMediaName = isOriginFirst ? 'original' : 'russian';
        this.secondMediaName = !isOriginFirst ? 'original' : 'russian';
    }

    onResultClick($event: MouseEvent, result: SearchbarResult, target: ResultOpenTarget): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.openResult.next([ result, target ]);
    }

}
