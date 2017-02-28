import {ParsedRequest} from './parsedrequest';
import {Headers, ResponseOptions} from '@angular/http';

export interface BackendListenerCallback {
    (p: ParsedRequest, matches: string[]): ResponseOptions;
}

export class BackendListener {
  method: string;
  uri: string|RegExp;
  /**
   *
   */
  cb: BackendListenerCallback = null;
  value: any = null;

  match(p: ParsedRequest): boolean {
    if (this.method !== p.method) {
      return false;
    }

    if ('string' === typeof this.uri) {
      if (p.uri === this.uri) {
        return true;
      }
      return false;
    }
    return p.uri.match(this.uri) != null;
  }

  getResponse(p: ParsedRequest): ResponseOptions {
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
