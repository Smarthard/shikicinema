export interface KodikApiResponse<T> {
    /* 1ms */
    time: string;
    total: number;
    results: T[];
}
