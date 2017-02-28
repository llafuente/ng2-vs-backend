import {URLSearchParams} from '@angular/http';

export class UrlParams {
  method: string = null;
  uri: string = null;
  params: any = {};
  query: any = {};
  body: any = {};

  setMethod(m: number): void {
    this.method = ['GET', 'POST', 'PUT',
     'DELETE', 'OPTIONS', 'HEAD', 'PATCH'][m];
  }

  /**
   * URL + querystring
   */
  parseUrl(url: string): void {
    var uri: string = url;
    var params: string = '';
    uri = uri.substring(uri.indexOf('/api'));
    var c: number = uri.indexOf('?');
    if (c !== -1) {
      params = uri.substring(c + 1);
      uri = uri.substring(0, c);
    }
    this.uri = uri;
    this.query = new URLSearchParams(params).paramsMap;
  }
}
