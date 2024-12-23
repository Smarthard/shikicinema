import { UploadToken } from '@app/shared/types/shikicinema/v1';

export interface ShikicinemaStoreInterface {
    isProcessing: boolean;
    uploadToken: UploadToken;

    errors: unknown;
}
