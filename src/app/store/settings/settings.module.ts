import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { SettingsState } from '@app/store/settings/settings.state';

@NgModule({
    imports: [
        NgxsModule.forFeature([
            SettingsState,
        ]),
    ],
})
export class SettingsModule {}
