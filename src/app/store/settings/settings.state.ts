import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import {
    State,
    Action,
    StateContext,
    Selector,
} from '@ngxs/store';

import {
    ResetSettingsAction,
    UpdateLanguageAction,
    UpdateSettingsAction,
} from '@app/store/settings/settings.actions';
import { defaultAvailableLangs } from '@app/transloco-root.module';

export interface SettingsStateModel {
    language: string;
    availableLangs: string[];
}

const defaults: SettingsStateModel = {
    language: '',
    availableLangs: defaultAvailableLangs,
};

@State<SettingsStateModel>({
    name: 'settings',
    defaults,
})
@Injectable()
export class SettingsState {

    constructor(
        private translate: TranslocoService,
    ) {}

    @Selector()
    static language(state: SettingsStateModel) {
        const { language, availableLangs } = state;

        return availableLangs?.includes(language) ? language : '';
    }

    @Action([
        UpdateSettingsAction,
        UpdateLanguageAction,
    ])
    update(
        ctx: StateContext<SettingsStateModel>,
        { config }: UpdateSettingsAction,
    ) {
        ctx.setState({
            ...ctx.getState(),
            ...config,
        });
    }

    @Action(ResetSettingsAction)
    reset(ctx: StateContext<SettingsStateModel>) {
        ctx.setState({
            ...defaults,
        });
    }

    @Action([
        UpdateSettingsAction,
        UpdateLanguageAction,
    ])
    async detectLangChangeEffect(
        _: StateContext<SettingsStateModel>,
        { config }: UpdateSettingsAction | UpdateLanguageAction,
    ) {
        const { language } = config;

        if (language) {
            this.translate.setActiveLang(language);
        }
    }

}
