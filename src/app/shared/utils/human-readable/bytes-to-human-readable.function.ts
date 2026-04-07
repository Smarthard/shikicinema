import { humanBytesMap } from '@app/shared/config/human-bytes.map';
import { humanBytesSiMap } from '@app/shared/config/human-bytes-si.map';

export function bytesToHumanReadable(bytes: number, isSIUnits = false, maxPower = -1) {
    const units = isSIUnits ? 1024 : 1000;
    const humanReadableMap = isSIUnits ? humanBytesSiMap : humanBytesMap;

    let mod = bytes;
    let power = 0;

    while (mod > units && maxPower < 0 || maxPower > 0 && power + 1 <= maxPower) {
        mod = Math.floor(mod / units);
        power++;
    }

    const hNum = power === 0
        ? bytes
        : (bytes / units ** power).toFixed(2);
    const hUnits = humanReadableMap.get(power);

    return `${hNum} ${hUnits}`;
}
