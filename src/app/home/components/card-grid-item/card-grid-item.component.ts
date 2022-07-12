import { Component, Input } from '@angular/core';

import { ImageCardComponent } from '@app/shared/components/image-card/image-card.component';
import { AnimeKindType } from '@app/shared/types/shikimori/anime-kind.type';

@Component({
    selector: 'app-card-grid-item',
    templateUrl: './card-grid-item.component.html',
    styleUrls: ['./card-grid-item.component.scss'],
})
export class CardGridItemComponent extends ImageCardComponent {

    @Input()
    name: string;

    @Input()
    kind: AnimeKindType;

    @Input()
    releaseDate: string | Date;

    @Input()
    link = '#';

}
