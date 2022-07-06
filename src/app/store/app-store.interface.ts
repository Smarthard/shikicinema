import AuthStoreInterface from '@app/store/auth/types/auth-store.interface';
import { SettingsStoreInterface } from '@app/store/settings/types/settings-store.interface';
import { ShikimoriStoreInterface } from '@app/store/shikimori/types/shikimori-store.interface';

export interface AppStoreInterface {
    auth: AuthStoreInterface;
    settings: SettingsStoreInterface;
    shikimori: ShikimoriStoreInterface;
}
