export interface IpcApiInterface {
    getShikimoriAuthCode(authUrl: string): Promise<string>;
}
