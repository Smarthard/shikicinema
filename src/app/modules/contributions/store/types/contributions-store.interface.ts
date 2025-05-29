import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1';

export default interface ContributionsStoreInterface {
    uploaderName: string;
    uploaderId: ResourceIdType;
    contributions: ShikivideosInterface[];
    errors: any;
}
