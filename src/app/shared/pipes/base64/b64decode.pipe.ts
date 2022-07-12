import { Pipe, PipeTransform } from '@angular/core';

import { fromBase64 } from '@app/shared/utils/base64-utils';

@Pipe({
    name: 'b64decode',
    pure: true,
})
export class B64decodePipe implements PipeTransform {
    transform(value: string): unknown {
        return fromBase64(value);
    }
}
