import { NgModule } from '@angular/core';

import { ShikimoriMediaNamePipe } from '@app/shared/pipes/shikimori-media-name/shikimori-media-name.pipe';

@NgModule({
    declarations: [
        ShikimoriMediaNamePipe,
    ],
    exports: [
        ShikimoriMediaNamePipe,
    ],
})
export class ShikimoriMediaNameModule {}
