import { UploaderIdType } from '@app/shared/types/uploader-id.type';
import { UploaderInterface } from '@app/modules/player/types';
import { UserInterface } from '@app/shared/types/shikimori/user.interface';

export function mapUserToUploader(
    { nickname: name, id, avatar, image, url }: UserInterface,
    count: number,
): UploaderInterface {
    return {
        name,
        url,
        avatar: image?.x160 || image?.x148 || avatar,
        id: `${id}` as UploaderIdType,
        count,
    };
}
