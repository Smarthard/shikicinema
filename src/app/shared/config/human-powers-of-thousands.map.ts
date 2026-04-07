import { ReadableNumberSuffixes } from '@app/shared/utils/human-readable';

export const humanPowersOfThousandsMap = new Map<number, ReadableNumberSuffixes>([
    [0, ReadableNumberSuffixes.NONE],
    [1, ReadableNumberSuffixes.THOUSANDS],
    [2, ReadableNumberSuffixes.MILLIONS],
    [3, ReadableNumberSuffixes.BILLIONS],
    [4, ReadableNumberSuffixes.TRILLIONS],
    [5, ReadableNumberSuffixes.QUADRILLIONS],
    [6, ReadableNumberSuffixes.QUINTILLTIONS],
    [7, ReadableNumberSuffixes.SEXTILLTIONS],
    [8, ReadableNumberSuffixes.SEPTILLIONS],
    [9, ReadableNumberSuffixes.OCTOLLIONS],
    [10, ReadableNumberSuffixes.NONILLIONS],
    [11, ReadableNumberSuffixes.DECILLIONS],
]);
