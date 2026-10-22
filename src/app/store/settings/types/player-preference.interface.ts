import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { PlayerPreferenceEntry } from '@app/store/settings/types/player-preference-entry.interface';

export interface PlayerPreferencesInterface {
    [animeId: ResourceIdType]: PlayerPreferenceEntry[];
}
export { PlayerPreferenceEntry };

