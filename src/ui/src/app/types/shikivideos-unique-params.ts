import {AbstractParams} from "./abstract-params";

export class ShikivideosUniqueParams extends AbstractParams {
  constructor(protected params: {
    anime_id: number,
    column: string,
    episode?: number,
    filter?: string,
    limit?: string,
    offset?: number
  }) {
    super(params);
  }
}
