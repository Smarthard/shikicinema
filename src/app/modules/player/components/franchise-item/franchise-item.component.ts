import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
} from '@angular/core';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { TranslocoPipe } from '@jsverse/transloco';

import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { ShikimoriFranchise } from '@app/shared/types/shikimori';
import { franchiseRelationI18N } from '@app/shared/types/shikimori/mappers';

@Component({
    selector: 'app-franchise-item',
    imports: [
        ImageCardComponent,
        NgxTippyModule,
        TranslocoPipe,
    ],
    templateUrl: './franchise-item.component.html',
    styleUrl: './franchise-item.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': '"franchise-item " + relationClass()',
    },
})
export class FranchiseItemComponent {
    readonly franchiseItem = input.required<ShikimoriFranchise>();
    readonly isEnglishNames = input(false)

    readonly anime = computed(() => this.franchiseItem().anime);

    readonly animeId = computed(() => this.anime()?.id);

    readonly name = computed(() => this.isEnglishNames()
        ? this.anime()?.name
        : this.anime()?.russian,
    );

    readonly relation = computed(() => franchiseRelationI18N(this.franchiseItem().relation));

    readonly relationClass = computed(() => this.relation()?.toLocaleLowerCase());
}
