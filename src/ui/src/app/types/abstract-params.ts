export class AbstractParams {
  constructor(protected params: any) {}

  public isEmptyParam(param: string): boolean {
    return !this.params[param] || this.params[param] === '';
  }

  public getSearchParams(): string {
    let params = '';
    let firstParam = true;
    let paramDelimeter = '?';

    for (let param of Object.keys(this.params)) {
      if (!this.isEmptyParam(param)) {
        params += `${paramDelimeter}${param}=${this.params[param]}`;
      }

      if (!this.isEmptyParam(param) && firstParam){
        firstParam = false;
        paramDelimeter = '&'
      }
    }

    return params;
  }
}
