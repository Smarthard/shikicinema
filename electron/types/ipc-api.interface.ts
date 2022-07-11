export interface IpcApiInterface {
    getShikimoriAuthCode(authUrl: string): Promise<string>;

    openInBrowser(url: string): void;
}
