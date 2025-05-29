export const reverseHumanBytesMap = new Map<string, number>([
    [undefined, -1],
    [null, -1],

    ['B', 0],

    ['kB', 1],
    ['MB', 2],
    ['GB', 3],
    ['TB', 4],
    ['PB', 5],
    ['EB', 6],
    ['ZB', 7],
    ['YB', 8],
    ['RB', 9],
    ['QB', 10],

    ['kiB', 1],
    ['MiB', 2],
    ['GiB', 3],
    ['TiB', 4],
    ['PiB', 5],
    ['EiB', 6],
    ['ZiB', 7],
    ['YiB', 8],
    ['RiB', 9],
    ['QiB', 10],
]);
