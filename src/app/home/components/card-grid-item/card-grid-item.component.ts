import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';

import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';

@Component({
    selector: 'app-card-grid-item',
    templateUrl: './card-grid-item.component.html',
    styleUrls: ['./card-grid-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CardGridItemComponent extends ImageCardComponent {
    @Input()
    kind: AnimeKindType;

    @Input()
    releaseDate: string | Date;

    @Input()
    link = '#';
}
