import {UrlParams} from './urlparams';
import {Headers, ResponseOptions} from '@angular/http';

export interface BackendListenerCallback {
    (p: UrlParams, matches: string[]): ResponseOptions;
}

export class BackendListener {
  method: string;
  uri: string|RegExp;
  /**
   *
   */
  cb: BackendListenerCallback = null;
  value: any = null;

  match(p: UrlParams): boolean {
    //console.log('method', this.method, p.method);

    if (this.method !== p.method) {
      return false;
    }

    //console.log('method', this.uri, p.uri);

    if ('string' === typeof this.uri) {
      if (p.uri === this.uri) {
        //console.log('match!!');
        return true;
      }
      return false;
    }
    return p.uri.match(this.uri) != null;
  }

  getResponse(p: UrlParams): ResponseOptions {
    let ret: any;

    if (this.cb != null) {
      let x: any = null;
      if ('string' !== typeof this.uri) {
        x = p.uri.match(this.uri);
      }

      ret = this.cb(p, x);
    } else {
      ret = this.value;
    }

    if (ret instanceof ResponseOptions) {
      return ret;
    }

    return new ResponseOptions({
      body: JSON.stringify(ret)
    });
  }

};
