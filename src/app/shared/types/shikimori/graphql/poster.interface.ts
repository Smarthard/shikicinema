import { ResourceIdType } from '@app/shared/types/resource-id.type';

export interface PosterGQL {
    id: ResourceIdType;
    main2xUrl: string;
    mainAlt2xUrl: string;
    mainAltUrl: string;
    mainUrl: string;
    mini2xUrl: string;
    miniAlt2xUrl: string;
    miniAltUrl: string;
    miniUrl: string;
    originalUrl: string;
    preview2xUrl: string;
    previewAlt2xUrl: string;
    previewAltUrl: string;
    previewUrl: string;
}
