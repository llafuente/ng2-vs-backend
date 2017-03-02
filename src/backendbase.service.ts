import { Injectable, OnInit } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  HttpModule,
  Http,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Headers,
  XHRBackend,
  RequestOptions,
  URLSearchParams
} from '@angular/http';

import {ParsedRequest} from './parsedrequest';
import {BackendListener, BackendListenerCallback} from './backendlistener';

@Injectable()
export abstract class BackendBaseService {
  listeners: BackendListener[] = [];
  initialized: boolean = false;

  constructor(
    public backend: MockBackend,
    public options: BaseRequestOptions,
    public realBackend: XHRBackend
  ) {
  }
  /**
   * if there is no handler, just do the XHR
   */
  fowardRequest(connection: MockConnection): void {
    // pass through any requests not handled above (updated with suggestion from Ryan's comment to include all request options)
    let realHttp: Http = new Http(this.realBackend, this.options);
    let requestOptions: RequestOptions = new RequestOptions({
      method: connection.request.method,
      headers: connection.request.headers,
      body: connection.request.getBody(),
      url: connection.request.url,
      withCredentials: connection.request.withCredentials,
      responseType: connection.request.responseType
    });
    realHttp.request(connection.request.url, requestOptions)
      .subscribe((response: Response) => {
        connection.mockRespond(response);
      },
      (error: any) => {
        connection.mockError(error);
      });
  }
  /**
   * It assume body is JSON
   */
  parseParams(connection: MockConnection): ParsedRequest {
    var p: ParsedRequest = new ParsedRequest();
    p.setMethod(connection.request.method);
    p.parseUrl(connection.request.url);
    // TODO handle request type!
    let body: string = connection.request.getBody();
    if (body && body.length) {
      try {
        p.body = JSON.parse(body);
      } catch (e) {
        console.error('invalid JSON found in the body');
      }
    } else {
      p.body = null; // TODO maybe {}
    }

    return p;
  }
  /**
   * handle a request. Search for a listener/value if not found do a XHR
   */
  handleRequest(connection: MockConnection): void {
    //console.info('Intercepted Request:', JSON.stringify(connection.request, null, 2));

    let params: any = this.parseParams(connection);
    // console.info('handleRequest to', params.uri, this.listeners);

    let rOpts: ResponseOptions = null;

    for (let i: number = 0; i < this.listeners.length; ++i) {
      if (this.listeners[i].match(params)) {
        rOpts = this.listeners[i].getResponse(params);
        // console.info('Intercepted Request: response', rOpts);
      }
    }

    if (rOpts != null) {
      //console.info('response found!', response);

      // Angular 2 do not set proper defaults if you create the ResponseOptions
      rOpts.headers = rOpts.headers || new Headers();
      rOpts.url = rOpts.url || connection.request.url;
      rOpts.status = rOpts.status || 200;
      rOpts.body = rOpts.body || null; // TODO maybe empty string?

      connection.mockRespond(new Response(rOpts));
    } else {
      //console.info('foward XHR');
      this.fowardRequest(connection);
    }
  }
  /**
   * Add a cb function so you can handle the request manually
   */
  addListener(method: string, uri: string|RegExp, cb: BackendListenerCallback): void {
    var l: BackendListener = new BackendListener();
    l.method = method;
    l.uri = uri;
    l.cb = cb;

    this.listeners.push(l);
  }
  /**
   * Return a single value untouched
   */
  addValue(method: string, uri: string|RegExp, value: any): void {
    var l: BackendListener = new BackendListener();
    l.method = method;
    l.uri = uri;
    l.value = value;

    this.listeners.push(l);
  }
  /**
   * Return values paginated
   */
  addValuePaginated(method: string, uri: string|RegExp, value: any): void {
    var l: BackendListener = new BackendListener();
    l.method = method;
    l.uri = uri;
    l.cb = (p: ParsedRequest) => {
      let querystr: string[] = p.query.get('query');
      let ret: any;
      let headers: Headers = new Headers();

      // filter criteria is present
      if (querystr && querystr.length) {
        let query: any = JSON.parse(querystr[0]);
        ret = value.slice(
          query.page * query.limit,
          (query.page + 1) * query.limit
        );

        headers.set('X-Total-Count', '' + value.length);
        headers.set('X-Page', '' + query.page);
        headers.set('X-Limit', '' + query.limit);
      } else {
        ret = value;

        headers.set('X-Total-Count', '' + value.length);
        headers.set('X-Page', '0');
        headers.set('X-Limit', '10');
      }

      return new ResponseOptions({
        body: JSON.stringify(ret),
        status: 200,
        headers: headers
      });
    };

    this.listeners.push(l);
  }

  init(): void {
    if (this.initialized) {
      throw new Error('Already initialized, shouldn\'t subscribe twice to backend.connections!');
    }

    this.initialized = true;
    this.backend.connections.subscribe(this.handleRequest.bind(this));
  }
}
