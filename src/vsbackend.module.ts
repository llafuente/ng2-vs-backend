import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule, Http, BaseRequestOptions, RequestOptions, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

// https://github.com/angular/angular/issues/11262
export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions): Http {
  return new Http(backend, defaultOptions);
}

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpModule],
  exports: [],
  providers: [
    // API: backend mock
    BaseRequestOptions,
    MockBackend,
    {
      provide: Http,
      deps: [MockBackend, BaseRequestOptions],
      useFactory: httpFactory
    },
  ]
})
export class VSBackendModule {}
