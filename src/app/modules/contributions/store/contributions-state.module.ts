import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { ContributionsEffects } from '@app/modules/contributions/store/effects/contributions.effects';
import { ShikicinemaV1Client, ShikimoriClient } from '@app/shared/services';
import { contibutionsReducer } from '@app/modules/contributions/store/reducers/contibutions.reducer';


@NgModule({
    imports: [
        StoreModule.forFeature('contributions', contibutionsReducer),
        EffectsModule.forFeature([
            ContributionsEffects,
        ]),
    ],
    providers: [
        ShikicinemaV1Client,
        ShikimoriClient,
    ],
})
export class ContributionsStateModule {}
