import { SettingsFormInterface } from '@app/modules/settings/utils/settings-form.interface';
import { SettingsStoreInterface } from '@app/store/settings/types';

export function mapSettinsFormToState(form: Partial<SettingsFormInterface>): Partial<SettingsStoreInterface> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { shikimoriDomain, ...rest } = form;

    return {
        ...rest,
    };
}
