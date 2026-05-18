import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class ShikicinemaMetaService {
    private manifest = chrome.runtime.getManifest();

    getAppVersion(): string {
        return this.manifest.version;
    }
}
