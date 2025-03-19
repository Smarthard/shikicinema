import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContributionsRoutingModule } from '@app/modules/contributions/contributions-routing.module';
import { ContributionsStateModule } from '@app/modules/contributions/store/contributions-state.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ContributionsRoutingModule,
        ContributionsStateModule,
    ],
})
export class ContributionsModule {}
