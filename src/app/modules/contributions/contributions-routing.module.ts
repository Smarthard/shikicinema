import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContributionsPage } from '@app/modules/contributions/contributions.page';

const routes: Routes = [
    {
        path: '',
        component: ContributionsPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContributionsRoutingModule {}
