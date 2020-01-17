export class ShikicinemaSettings {

  public oldFagApproves: boolean = true;
  public extraButtons: boolean = false;
  public filters = {
    enabled: true,
    language: false,
    player: true,
    author: true,
    quality: true
  };

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
