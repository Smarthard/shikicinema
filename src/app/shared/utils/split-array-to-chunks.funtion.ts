export function splitArrayToChunks<T>(array: T[], chunkSize: number): T[][] {
    const chunksCount = Math.ceil(array.length / chunkSize);

    return new Array(chunksCount)
        .fill(0)
        .map((_, index) => index * chunkSize)
        .map((startIndex) => array.slice(startIndex, startIndex + chunkSize));
}
