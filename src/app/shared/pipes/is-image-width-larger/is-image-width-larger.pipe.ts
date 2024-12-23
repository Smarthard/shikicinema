import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isImageWidthLarger',
    pure: true,
    standalone: true,
})
export class IsImageWidthLargerPipe implements PipeTransform {
    transform(image: HTMLImageElement = null): boolean {
        const { naturalWidth: width = 0, naturalHeight: height = 0 } = image || {};

        return width > height;
    }
}
