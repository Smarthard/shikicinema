import { NgModule } from '@angular/core';

import { B64decodePipe } from '@app/shared/pipes/base64/b64decode.pipe';
import { B64encodePipe } from '@app/shared/pipes/base64/b64encode.pipe';

@NgModule({
    declarations: [
        B64encodePipe,
        B64decodePipe,
    ],
    exports: [
        B64encodePipe,
        B64decodePipe,
    ],
})
export class Base64Module {}
