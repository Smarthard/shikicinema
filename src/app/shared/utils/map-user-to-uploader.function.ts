import { UploaderInterface } from '@app/modules/player/types';
import { UserInterface } from '@app/shared/types/shikimori/user.interface';

export function mapUserToUploader({ nickname: name, id, avatar, url }: UserInterface): UploaderInterface {
    return { name, id, avatar, url };
}
