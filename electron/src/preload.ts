import { contextBridge, ipcRenderer } from 'electron';
import { IpcApiInterface } from '../types/ipc-api.interface';

require('./rt/electron-rt');

contextBridge.exposeInMainWorld('electron', {
    async getShikimoriAuthCode(authUrl: string) {
        return await ipcRenderer.invoke('shikimori-auth-code', authUrl);
    },
} as IpcApiInterface);
