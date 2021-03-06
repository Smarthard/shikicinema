export class ShikicinemaSettings {

  public displayComments = true;
  public displayCommentPreview = true;
  public oldFagApproves = true;
  public episodeListType: EpisodesListTypes = EpisodesListTypes.SCROLLABLE;
  public extraButtons = false;
  public theme: 'light' | 'dark' | 'custom' = 'dark';
  public playerTabOpens: 'new' | 'same' = 'new';
  public playerFiltersEnabled = true;
  public forceToUseShikimoriTokens = true;
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
