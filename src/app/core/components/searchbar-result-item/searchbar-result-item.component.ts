import { DatePipe, UpperCasePipe } from '@angular/common';
import {
    Component,
    computed,
    inject,
    input,
    output,
    ViewEncapsulation,
    Injector,
} from '@angular/core';
import {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonNote,
    IonText,
} from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';

import { ImageCardComponent } from '@app/shared/components/image-card';
import { ShikimoriMediaNamePipe } from '@app/shared/pipes/shikimori-media-name/shikimori-media-name.pipe';
import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori';
import { injectShikimoriDomain } from '@app/shared/utils/inject-shikimori-domain.function';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types';

@Component({
    selector: 'app-searchbar-result-item',
    styleUrl: './searchbar-result-item.component.scss',
    templateUrl: './searchbar-result-item.component.html',
    imports: [
        IonButton,
        IonItem,
        IonIcon,
        IonLabel,
        IonNote,
        IonText,
        DatePipe,
        TranslocoPipe,
        UpperCasePipe,
        ImageCardComponent,
        ShikimoriMediaNamePipe,
    ],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'searchbar-result-item'
    }
})
export class SearchbarResultItemComponent {
    private readonly injector = inject(Injector);

    readonly item = input.required<AnimeBriefInfoInterface>();
    readonly isOriginalNameFirst = input(false);

    readonly open = output<[SearchbarResult, ResultOpenTarget]>();

    readonly posterUrl = computed(() => injectShikimoriDomain(this.item().image.original, this.injector));
    protected readonly firstMediaName = computed(() => this.isOriginalNameFirst() ? 'original' : 'russian');
    protected readonly secondMediaName = computed(() => !this.isOriginalNameFirst() ? 'original' : 'russian');

    onResultClick($event: Event, result: SearchbarResult, target: ResultOpenTarget): void {
        $event.stopPropagation();
        $event.preventDefault();

        this.open.emit([result, target]);
    }
}
