import { ImageLoader, ImageLoaderConfig } from '@angular/common';

import { getPath } from '@app/shared/utils/get-path.function';

// TODO: реализовать выбор меньших разрешений для ограниченного интернет соединения
export const smarthardNetImageLoader = (): ImageLoader => {
    const domain = 'https://smarthard.net';

    return (config: ImageLoaderConfig): string => {
        if (config?.src?.startsWith('/assets/')) {
            return config.src;
        }

        const path = getPath(config.src);
        const isSmarthardNet = config?.src?.startsWith(domain);

        if (!isSmarthardNet) {
            return config?.src;
        }

        const { isPlaceholder = false } = config;
        const [imagePath, extension] = path?.split('.');
        const extensionPath = isPlaceholder
            ? '-placeholder.jpeg'
            : `.${extension}`;

        if (`${domain}${imagePath}${extensionPath}` === 'https://smarthard.net/static/animes/undefined.avif') {
            console.log('???', config);
        }

        return `${domain}${imagePath}${extensionPath}`;
    };
};
