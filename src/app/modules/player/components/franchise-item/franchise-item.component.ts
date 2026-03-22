import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
} from '@angular/core';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { ShikimoriFranchise } from '@app/shared/types/shikimori';
import { ToFranchiseRelationPipe } from '@app/modules/player/pipes';

@Component({
    selector: 'app-franchise-item',
    imports: [
        ImageCardComponent,
        NgxTippyModule,
        ToFranchiseRelationPipe,
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
    franchiseItem = input.required<ShikimoriFranchise>();
    isEnglishNames = input(false)

    readonly anime = computed(() => this.franchiseItem().anime);

    readonly animeId = computed(() => this.anime()?.id);

    readonly name = computed(() => this.isEnglishNames()
        ? this.anime()?.name
        : this.anime()?.russian,
    );

    readonly relation = computed(() => this.isEnglishNames()
        ? this.franchiseItem().relation
        : this.franchiseItem().relation_russian,
    );

    readonly relationClass = computed(() => this.franchiseItem().relation.toLocaleLowerCase().replace(/\s+/, '-'));
}
