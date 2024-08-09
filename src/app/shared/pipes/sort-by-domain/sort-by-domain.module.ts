import { NgModule } from '@angular/core';

import { GetUrlDomainPipe } from '@app/shared/pipes/get-url-domain/get-url-domain.pipe';
import { SortByDomainPipe } from '@app/shared/pipes/sort-by-domain/sort-by-domain.pipe';

@NgModule({
    declarations: [SortByDomainPipe],
    exports: [SortByDomainPipe],
    providers: [GetUrlDomainPipe],
})
export class SortByDomainModule {}
