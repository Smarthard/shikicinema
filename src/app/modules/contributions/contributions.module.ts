import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContributionsStateModule } from '@app/modules/contributions/store/contributions-state.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ContributionsStateModule,
    ],
})
export class ContributionsModule {}
