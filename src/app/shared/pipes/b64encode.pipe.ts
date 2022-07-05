import { Pipe, PipeTransform } from '@angular/core';

import { toBase64 } from '@app/shared/utils/base64-utils';

@Pipe({
    name: 'b64encode',
    pure: true,
})
export class B64encodePipe implements PipeTransform {
    transform(value: string): unknown {
        return toBase64(value);
    }
}
