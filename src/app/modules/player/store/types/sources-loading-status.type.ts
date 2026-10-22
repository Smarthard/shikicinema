import { VideoSourceEnum } from "@app/shared/types/video-source.enum";

export type SourceLoadingStatusInterface = {
    [source in VideoSourceEnum]: boolean;
}
