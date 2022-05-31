import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';

export interface AppStoreInterface {
    settings: SettingsStoreInterface;
    shikimori: ShikimoriStoreInterface;
}
