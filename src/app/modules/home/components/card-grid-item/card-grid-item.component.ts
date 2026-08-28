import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    input,
} from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { AbstractImageCardComponent } from '@app/shared/components/abstract-image-card/abstract-image-card.component';
import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { SkeletonBlockComponent } from '@app/shared/components/skeleton-block/skeleton-block.component';

@Component({
    selector: 'app-card-grid-item',
    templateUrl: './card-grid-item.component.html',
    styleUrls: ['./card-grid-item.component.scss'],
    imports: [
        RouterLink,
        UpperCasePipe,
        TranslocoPipe,
        DatePipe,
        NgxTippyModule,
        SkeletonBlockComponent,
        ImageCardComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'card-grid-item',
    }
})
export class CardGridItemComponent extends AbstractImageCardComponent {
    kind = input<AnimeKindType | null>();
    airedDate = input<string | Date | null>();
    link = input('#');
    hasPriority = input(false);
    override backgroundSize = input<string>('cover');
}
