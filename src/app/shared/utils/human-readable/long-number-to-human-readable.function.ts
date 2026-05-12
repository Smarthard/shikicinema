import { ReadableNumberSuffixes } from '@app/shared/utils/human-readable/readable-number-suffixes.enum';
import { humanPowersOfThousandsMap } from '@app/shared/config/human-powers-of-thousands.map';

interface HumanReadableLongNumber {
    number: number;
    suffix: ReadableNumberSuffixes;
}

export function longNumberToHumanReadable(number: number): HumanReadableLongNumber {
    let suffix = ReadableNumberSuffixes.NONE;
    let value = 0;

    if (number === 0) {
        return {
            number,
            suffix,
        };
    }

    const powerOfThousands = Math.floor(Math.log(Math.abs(number)) / Math.log(1000));

    value = Math.floor(number / Math.pow(1000, powerOfThousands));
    suffix = humanPowersOfThousandsMap.get(powerOfThousands) || ReadableNumberSuffixes.NONE;

    return {
        number: value,
        suffix,
    }
}
