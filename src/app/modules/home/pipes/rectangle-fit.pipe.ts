import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rectangleFit',
    standalone: true,
    pure: true,
})
export class RectangleFitPipe implements PipeTransform {
    transform(isWidthGreater: boolean): 'contain' | 'cover' {
        return isWidthGreater ? 'contain' : 'cover';
    }
}
