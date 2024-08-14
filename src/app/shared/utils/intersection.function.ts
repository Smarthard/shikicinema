export function intersection<T>(...arrays: T[][]): T[] {
    return arrays?.reduce((prevArr, curArr) => prevArr.filter((item) => curArr.includes(item)));
}
