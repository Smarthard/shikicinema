import { Pipe, PipeTransform } from '@angular/core';

import { Bytes, BytesSI } from '@app/shared/types/bytes.type';
import { bytesToHumanReadable } from '@app/shared/utils/bytes-to-human-readable.function';
import { reverseHumanBytesMap } from '@app/shared/config/reverse-human-bytes.map';

@Pipe({
    name: 'toHumanReadableBytes',
    standalone: true,
})
export class ToHumanReadableBytesPipe implements PipeTransform {
    transform(bytes: number, isSIUnits = false, capBy: Bytes | BytesSI = undefined): unknown {
        const maxPower = reverseHumanBytesMap.get(capBy);

        return bytesToHumanReadable(bytes, isSIUnits, maxPower);
    }
}
