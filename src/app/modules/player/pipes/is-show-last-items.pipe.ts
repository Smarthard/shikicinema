import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isShowLastItems',
    standalone: true,
})
export class isShowLastItemsPipe implements PipeTransform {
    transform<T extends ArrayLike<any>>(values: T, index: number, lastVisibleItemsCount: number): boolean {
        return index < values?.length - lastVisibleItemsCount;
    }
}
