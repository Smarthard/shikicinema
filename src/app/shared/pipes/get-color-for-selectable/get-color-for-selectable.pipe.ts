import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getColorForSelectable',
    pure: true,
    standalone: true,
})
export class GetColorForSelectablePipe implements PipeTransform {
    transform(isSelected: boolean): string {
        return isSelected ? 'primary' : 'dark';
    }
}
