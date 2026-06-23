import { ResourceIdType } from '@app/shared/types';

export function formatPreviewNote<T extends { id: ResourceIdType } | string>(
    selectedValues: ResourceIdType[] | string[] | undefined,
    options: T[],
    getName: (item: T, lang: string) => string,
    language: string = 'ru',
    max = 3,
): string | undefined {
    const count = selectedValues?.length ?? 0;

    const preview = count > 0
        ? selectedValues
            ?.slice(0, max)
            ?.map((selected) => options.find((option) => typeof option === 'string'
                ? option === selected
                : option.id === selected,
            ))
            ?.filter(Boolean)
            ?.map((item) => getName(item as T, language))
            ?.join(', ')
        : '';

    return count > max ? `${preview}, ... +${count - max}` : preview;
}
