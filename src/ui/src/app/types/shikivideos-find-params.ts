import { AbstractParams } from "./abstract-params";

export class ShikivideosFindParams extends AbstractParams {
  constructor(protected params: {
      author?: string,
      episode?: string,
      kind?: 'озвучка' | 'оригинал' | 'субтитры',
      lang?: string,
      limit?: string,
      offset?: number,
      uploader?: string,
      quality?: string,
      title?: string
  }) {
    super(params);
  }
}
