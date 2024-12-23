import { PreferencesValueType } from '@app/store/settings/types/preference-value.type';
import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface PreferencesInterface<T> {
    [animeId: ResourceIdType]: PreferencesValueType<T>;
}
