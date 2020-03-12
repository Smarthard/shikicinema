export class ShikicinemaSettings {

  public oldFagApproves: boolean = true;
  public episodeListType: EpisodesListTypes = EpisodesListTypes.SCROLLABLE;
  public extraButtons: boolean = false;
  public playerFiltersEnabled: boolean = true;
  public playerFilters: Array<IFilter> = [
    {
      enabled: true,
      name: 'author'
    },
    {
      enabled: false,
      name: 'language'
    },
    {
      enabled: true,
      name: 'url'
    },
    {
      enabled: true,
      name: 'quality'
    }
  ];

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}

export enum EpisodesListTypes {
  DEFAULT,
  SCROLLABLE
}

interface IFilter {
  enabled: boolean,
  name: string
}
