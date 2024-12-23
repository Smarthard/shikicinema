export function isDueTime(time: number | Date | string): boolean {
    const now = Date.now();
    const dueTime = new Date(time).getTime();

    return dueTime > now;
}
