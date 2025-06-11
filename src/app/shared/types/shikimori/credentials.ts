export interface Credentials {
    access_token: string;
    refresh_token: string;

    /** пример: 1749643136 (секунды!)  */
    created_at: number;

    /** пример: 86400 (секунды!)  */
    expires_in: number;

    /** пример: "user_rates comments topics" */
    scope: string;
}
