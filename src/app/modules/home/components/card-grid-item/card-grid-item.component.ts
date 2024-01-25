import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';

import { AbstractImageCardComponent } from '@app/shared/components/abstract-image-card/abstract-image-card.component';
import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';
import { scale } from '@app/shared/animations/scale';

@Component({
    selector: 'app-card-grid-item',
    templateUrl: './card-grid-item.component.html',
    styleUrls: ['./card-grid-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        scale(),
    ],
})
export class CardGridItemComponent extends AbstractImageCardComponent {
    @HostBinding('class.card-grid-item')
    cardGridItemClass = true;

    @Input()
    kind: AnimeKindType;

    @Input()
    releaseDate: string | Date;

    @Input()
    link = '#';

    mouseOver = false;
}
